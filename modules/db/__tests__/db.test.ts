import * as config from "config";

describe("the database connection", () => {
  it("is configured by the environment", () => {
    expect(config.get("environment")).toEqual("test");
    expect(config.get("databaseUrl")).toMatch(/^postgres:/);
  });
});
