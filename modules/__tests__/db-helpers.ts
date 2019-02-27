import { ClientState, DEFAULTS } from "client/graphql/state-link";
import * as db from "db";
import { Context } from "graphql-api/context";

import * as uuid from "uuid";
import { getRedisConnection } from "db/redis";
import * as Blueprints from "atomic-object/blueprints";
import { SavedUser } from "records/user";
import { JobRunner } from "atomic-object/jobs/mapping";

export function withTransactionalConnection(
  fn: (knex: db.Knex) => Promise<any>
) {
  return async () => {
    const knex = db.getConnection();
    try {
      await knex.transaction(async trx => {
        // await trx.raw("SET TRANSACTION ISOLATION LEVEL SERIALIZABLE");
        db._setConnection(trx);
        // await truncateAll(context);
        await fn(trx);
        throw new Error("abort transaction");
      });
    } catch (e) {
      if (e.message !== "abort transaction") {
        throw e;
      }
    } finally {
      db._setConnection(knex);
    }
  };
}

type ContextFn = (
  context: Context,
  extra: { universe: Blueprints.Universe; user: SavedUser | null }
) => void | any;
type WithContextArgs = {
  initialState?: Partial<ClientState>;
  userScenario?: (universe: Blueprints.Universe) => Promise<SavedUser>;
  run: ContextFn;
};

export function withContext(
  fnOrObj: WithContextArgs | ContextFn
): () => Promise<any> {
  return withTransactionalConnection(async db => {
    const args: WithContextArgs =
      typeof fnOrObj === "function" ? { run: fnOrObj } : fnOrObj;

    const initialState = args.initialState;
    const fullInitialState = Object.assign({}, DEFAULTS, initialState);

    const redisPrefix = `test:${uuid()}:`;

    let context: Context;
    const jobs = new JobRunner(redisPrefix, () => context.clone());
    context = new Context({
      db,
      initialState: fullInitialState,
      redisPrefix,
      jobs,
    });

    const universe = new Blueprints.Universe(context);

    let user: SavedUser | null = null;
    if (args.userScenario) {
      user = await args.userScenario(universe);
      context.userId = user.id;
    }

    try {
      await args.run(context, { universe, user });
    } finally {
      await context.destroy();
      await jobs.close();
      const redis = getRedisConnection();
      const keys = await redis.keys(`${redisPrefix}*`);
      if (keys.length > 0) {
        await redis.del(...keys);
      }
    }
  });
}
