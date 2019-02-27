// Update with your config settings.
const config = require("config");
// import * as config from config;

module.exports = {
  test: {
    client: "pg",
    connection: config.get("databaseUrl"),
    migrations: {
      directory: __dirname + "/db/migrations",
    },
    seeds: {
      directory: __dirname + "/db/seeds/test",
    },
  },
  development: {
    client: "pg",
    connection: config.get("databaseUrl"),
    migrations: {
      directory: __dirname + "/db/migrations",
    },
    seeds: {
      directory: __dirname + "/db/seeds/development",
    },
  },
  production: {
    client: "pg",
    connection: config.get("databaseUrl"),
    migrations: {
      directory: __dirname + "/db/migrations",
    },
    seeds: {
      directory: __dirname + "/db/seeds/production",
    },
  },
};
