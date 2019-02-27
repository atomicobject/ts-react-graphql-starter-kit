const { getConnection, destroyConnection, truncateAll } = require("db");
const cp = require("child_process");
const redis = require("db/redis");

module.exports = async () => {
  if (process.env.NODE_ENV !== "test") {
    console.log("Refusing to truncate non-test db");
    return;
  }

  await truncateAll(getConnection());
  // await cp.exec("./node_modules/.bin/knex db:seed:run");
  await destroyConnection();

  const keys = await redis.getRedisConnection().keys("test:*");
  if (keys.length > 0) await redis.getRedisConnection().del(...keys);
  await redis.destroyConnection();
};
