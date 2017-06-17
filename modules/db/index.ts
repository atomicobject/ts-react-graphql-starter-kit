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
