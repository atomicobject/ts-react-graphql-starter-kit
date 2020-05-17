import { withContext } from "__tests__/db-helpers";

describe("EventLogRepository", () => {
  describe("insert", () => {
    it(
      "works",
      withContext(async ctx => {
        const result = await ctx.repos.eventLog.insert({
          type: "foo",
          payload: { userId: 1 },
          effect: null,
        });
        expect(result.timestamp).toBeInstanceOf(Date);
        expect(result.index).toMatch(/^\d+$/);
        expect(result.type).toEqual("foo");
        expect(result.payload).toEqual({ userId: 1 });
      })
    );
  });
});
