import * as Cache from "atomic-object/cache";
import { withContext } from "__tests__/db-helpers";

describe("Caching via the Context", () => {
  it(
    "can cache operations",
    withContext(async ctx => {
      let counter = 0;
      const opSpec = Cache.fromStringableArg<number, string>({
        key: "fuhgeddaboutit",
        async func(arg) {
          counter++;
          return String(arg);
        },
        settings: {
          minAgeMs: 900,
          maxAgeMs: 30000,
          graceMs: 300,
        },
      });

      const tenValue = await ctx.cache.get(opSpec, 10);
      expect(tenValue).toEqual("10");

      const tenValue2 = await ctx.cache.get(opSpec, 10);
      expect(tenValue2).toEqual("10");

      expect(counter).toBe(1);
    })
  );

  it(
    "can cache operations which don't need a key",
    withContext(async ctx => {
      let counter = 0;
      const opSpec: Cache.Singleton<string> = {
        key: "fuhgeddaboutit",
        async func() {
          counter++;
          return "fuhgot";
        },
        settings: {
          minAgeMs: 900,
          maxAgeMs: 30000,
          graceMs: 300,
        },
      };

      const result1 = await ctx.cache.get(opSpec);
      expect(result1).toEqual("fuhgot");

      const result2 = await ctx.cache.get(opSpec);
      expect(result2).toEqual("fuhgot");

      expect(counter).toBe(1);
    })
  );
});
