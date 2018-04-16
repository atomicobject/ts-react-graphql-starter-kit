import { getConnection, destroyConnection, truncateAll } from "db";
import * as cp from "child_process";

module.exports = async () => {
  if (process.env.NODE_ENV !== "test") {
    console.log("Refusing to truncate non-test db");
    return;
  }

  await truncateAll(getConnection());
  await cp.exec("./node_modules/.bin/knex db:seed:run");
};
