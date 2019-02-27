import { Context } from "graphql-api/context";
import { withContext } from "__tests__/db-helpers";
import { Actions, declareAction } from "../actions";
import { Dispatcher, DispatcherFn } from "../dispatch";
import * as Jobs from "atomic-object/jobs";

/***********************************************************************************/
type Payload = { name: string };

const theJob = Jobs.declare({
  identifier: "TestAction",
  process: Jobs.processWithContext<Payload>(async ({ ctx, job }) => {
    const data = job.data;
    await ctx.repos.eventLog.insert({
      type: "foo",
      payload: {},
      effect: {},
    });
  }),
});

const action1 = declareAction({
  type: "TestAction",
  schema: { type: "object" },
  backgroundJob: theJob,
});

const actions = new Actions().with(action1);

describe("Dispatching actions", () => {
  it(
    "works",
    withContext(async ctx => {
      ctx.jobs.register(...actions.backgroundJobs);
      const dispatch: DispatcherFn<typeof actions> = new Dispatcher(
        ctx,
        actions
      ).orThrow;

      const result = await dispatch({
        type: "TestAction",
        payload: { name: "Fort ctx" },
      });
      expect(await ctx.repos.eventLog.count()).toEqual(1);

      expect(result.value).toBeFalsy();

      await ctx.jobs.runAll();

      const [savedEvent] = await ctx.repos.eventLog.allWithType(action1);
      expect(result.event).toEqual(savedEvent);

      expect(savedEvent.effect!.backgroundJobId).toMatch(/\w/);
      expect(savedEvent.effect!.backgroundJobId).toEqual(
        result.backgroundJobId
      );

      expect(await ctx.repos.eventLog.count()).toEqual(2);
      // console.log(
      //   await ctx.jobs.getJob(action1.backgroundJob!, savedEvent.effect!
      //     .backgroundJobId as any)
      // );
    })
  );
});
