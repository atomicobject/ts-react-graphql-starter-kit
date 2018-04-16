import * as config from "config";
const env = config.get<string>("environment");

const knexConfig: any = require("../../knexfile")[env];

import * as knexModule from "knex";

export type Knex = knexModule;
const knex: typeof knexModule = require("knex");

/** The currently open connection. Set by getConnection and destroyConnection */
let $connection: knexModule | undefined = undefined;

/** A promisified alias of knex.destroy(). */
export function destroyConnection(): Promise<void> {
  return new Promise<void>(resolve => {
    if ($connection) {
      $connection.destroy(resolve);
      $connection = undefined;
    } else {
      resolve();
    }
  });
}

export function getConnection() {
  if (!$connection) {
    $connection = knex(knexConfig);
  }
  return <knexModule>$connection;
}

export function _setConnection(knex: Knex) {
  $connection = knex;
}

export async function truncateAll(knex: Knex) {
  const result = await knex.raw(`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema='public'
      AND table_type='BASE TABLE';
   `);
  const tables: string[] = result.rows.map((r: any) => r.table_name);
  const recordTables = tables.filter(t => !t.includes("knex"));

  const promises = recordTables.map(tableName => {
    try {
      // console.log(`Truncating ${tableName}`);
      return knex.raw(`TRUNCATE "${tableName}" CASCADE`);
    } catch (e) {
      console.error(e);
    }
  });
  await Promise.all(promises);
}
