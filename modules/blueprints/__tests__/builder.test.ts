import * as Factory from "atomic-object/blueprints/blueprint";
describe("FactoryBuilder", () => {
  it("builds an object if no values are provided", async () => {
    type Thing = {
      name: string;
      id: number;
    };

    const factory = Factory.design<Thing>({
      name: "Thing One",
      id: i => Promise.resolve(i),
    });

    let result = await factory.build();
    expect(result.id).toEqual(0);
    expect(result.name).toEqual("Thing One");
  });

  it("increments the sequence number on subsequent build calls", async () => {
    type Thing = {
      name: string;
      id: number;
    };

    const factory = Factory.design<Thing>({
      name: "Thing One",
      id: i => Promise.resolve(i),
    });

    let result = await factory.build();
    expect(result.id).toEqual(0);
    expect(result.name).toEqual("Thing One");

    result = await factory.build();
    expect(result.id).toEqual(1);
    expect(result.name).toEqual("Thing One");
  });

  it("accepts a value from the partial", async () => {
    type Thing = {
      name: string;
      id: number;
    };

    const factory = Factory.design<Thing>({
      name: "Thing One",
      id: i => Promise.resolve(i),
    });

    let result = await factory.build({ name: "Thing Two" });
    expect(result.id).toEqual(0);
    expect(result.name).toEqual("Thing Two");
  });

  it("accepts a value that is just a function", async () => {
    type Thing = {
      name: string;
      id: number;
    };

    const factory = Factory.design<Thing>({
      name: "Thing One",
      id: i => i,
    });

    let result = await factory.build({ name: "Thing Two" });
    expect(result.id).toEqual(0);
    expect(result.name).toEqual("Thing Two");
  });
});
