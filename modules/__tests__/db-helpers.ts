import * as db from "db";
import { Context } from "graphql-api/context";

export function withTransactionalConnection(
  fn: (knex: db.Knex) => Promise<any>
) {
  return async () => {
    const knex = db.getConnection();
    try {
      await knex.transaction(async trx => {
        await trx.raw("SET TRANSACTION ISOLATION LEVEL SERIALIZABLE");
        db._setConnection(trx);
        // await truncateAll(context);
        await fn(trx);
        throw "abort transaction";
      });
    } catch (e) {
      if (e !== "abort transaction") {
        throw e;
      }
    } finally {
      db._setConnection(knex);
    }
  };
}

export function withContext(
  fn: (context: Context) => void | any
): () => Promise<any> {
  return withTransactionalConnection(async db => {
    const context = new Context(db);
    await fn(context);
  });
}

afterAll(async () => {
  await db.destroyConnection();
});
