const spawn = require("cross-spawn");
import * as fixtures from "fixtures";
import * as db from "db";

export const migrateAndSeed = async () => {
  if (process.env.USE_FAKE_DATA) {
    // && process.env.NODE_ENV == "production") {
    const knex = db.getConnection();
    try {
      console.log("Truncating tables");
      await db.truncateAll(knex);
    } catch (e) {
      console.log("Error truncating tables", e);
      await db.destroyConnection();
    }
  }

  spawn.sync("yarn", ["run", "db:migrate:latest:dev"], { stdio: "inherit" });

  if (process.env.USE_FAKE_DATA) {
    // && process.env.NODE_ENV == "production") {
    try {
      await fixtures.seedScenarios(db.getConnection());
    } catch (e) {
      console.log("Error generating data", e);
    } finally {
      await db.destroyConnection();
    }
  }
};
