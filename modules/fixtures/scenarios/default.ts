import { Universe } from "atomic-object/blueprints";
import * as Blueprint from "blueprints";
import { toIsoDate } from "core/date-iso";
import { addMonths } from "date-fns";
import { Knex } from "db";
import { Context } from "graphql-api/context";

export async function seed(knex: Knex): Promise<null> {
  const context = new Context({ db: knex, redisDisabled: true });
  const universe = new Universe(context);

  await universe.insert(Blueprint.user, {});

  await context.destroy();
  return Promise.resolve(null);
}
