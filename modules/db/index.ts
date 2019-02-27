import * as config from "config";
const env = config.get<string>("environment");

const knexConfig: any = require("../../knexfile")[env];

import * as knexModule from "knex";

export type Knex = knexModule;
const knex: typeof knexModule = require("knex");

/** The currently open connection. Set by getConnection and destroyConnection */
let $connection: knexModule | undefined = undefined;

export async function destroyConnection() {
  if ($connection) {
    await $connection.destroy();
    $connection = undefined;
  }
}

export function getConnection() {
  if (!$connection) {
    /*
        Node types for Postgres types

        - When the postgres driver encounters a *datetime*, it creates a JavaScript Date. Cool!
        - When the postgres driver encounters a *time*, it creates a JavaScript string. Cool.
        - When the postgres driver encounters a *date* (not implying a time of day), it creates a JavaScript Date. Boo!

        This customizes the behavior to pass it through as a string, reducing the risk of time zone drift, etc.

        https://stackoverflow.com/a/50717046/202907

     */
    var pgTypes = require("pg").types;
    pgTypes.setTypeParser(1082, (val: string) => val);

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
  const escapedTableNameList = recordTables.map(n => `"${n}"`).join(", ");
  await knex.raw(`TRUNCATE ${escapedTableNameList} CASCADE`);
}
