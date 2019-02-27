import { withContext } from "__tests__/db-helpers";
import * as redis from "db/redis";

import * as Job from "..";
interface Data {
  info: string;
}

export const UpdateIndex = Job.declare({
  identifier: "subrank/updateIndex",
  process: Job.processWithContext<Data>(async context => {
    await redis.getRedisConnection().set("foo", "bar");
  }),
});

describe("Running jobs in a test", () => {
  it(
    "Can run the job",
    withContext(async ctx => {
      ctx.jobs.register(UpdateIndex);
      const id = await ctx.jobs.enqueue(UpdateIndex, {
        info: "Hello!",
      });
      await ctx.jobs.runAll();

      const job = await ctx.jobs.getJob(UpdateIndex, id);
      expect(await job.getState()).toEqual("completed");
      const foo = await redis.getRedisConnection().get("foo");
      expect(foo).toEqual("bar");
      await redis.getRedisConnection().del("foo");
    })
  );
});
