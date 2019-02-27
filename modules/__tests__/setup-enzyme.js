const Enzyme = require("enzyme");
const Adapter = require("enzyme-adapter-react-16");
const db = require("db");
const redis = require("db/redis");

Enzyme.configure({ adapter: new Adapter() });

afterAll(async () => {
  await db.destroyConnection();
  await redis.destroyConnection();
});
