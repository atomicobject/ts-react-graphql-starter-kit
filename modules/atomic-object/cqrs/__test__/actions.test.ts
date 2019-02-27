import { withContext } from "__tests__/db-helpers";
import { Actions, declareAction } from "../actions";
import { Dispatcher } from "../dispatch";

/***********************************************************************************/

const action1 = declareAction({
  type: "TestAction",
  schema: { type: "object" },
  isolationLevel: "READ COMMITTED",
  async handler(payload: { name: string }, { repos }) {
    const { name } = payload;
    return await repos.users.insert({
      firstName: name,
      lastName: "foo",
    });
  },
});

const brokenAction = declareAction({
  type: "BrokenAction",
  schema: { type: "object" },
  isolationLevel: "READ COMMITTED",
  async handler(payload: { message: string }, { repos }) {
    throw new Error(payload.message);
  },
});

const nonValidatingAction = declareAction({
  type: "NonValidatingAction",
  schema: { type: "number" },
  isolationLevel: "READ COMMITTED",
  async handler(payload: { message: string }, { repos }) {},
});

const capturingAction = declareAction({
  type: "CapturingAction",
  schema: {
    type: "object",
    definitions: {
      effect: {
        type: "object",
        properties: {
          foo: { type: "number" },
        },
        required: ["foo"],
      },
    },
  },
  isolationLevel: "READ COMMITTED",
  async handleAndCaptureEffect(payload: { foo: number }) {
    return [{}, payload];
  },
});

const actions = new Actions()
  .with(action1)
  .with(brokenAction)
  .with(nonValidatingAction)
  .with(capturingAction);

describe("Dispatching actions", () => {
  it(
    "works",
    withContext(async ctx => {
      const dispatch = new Dispatcher(ctx, actions).valueOrThrow;

      const result = await dispatch({
        type: "TestAction",
        payload: { name: "Fort ctx" },
      });

      expect(result.id).toBeGreaterThan(0);
      expect(result.firstName).toEqual("Fort ctx");

      const [event] = await ctx.repos.eventLog.table();
      expect(event.type).toEqual("TestAction");
      expect(event.payload).toEqual({ name: "Fort ctx" });
    })
  );

  it(
    "Does not log on failure",
    withContext(async ctx => {
      const dispatch = new Dispatcher(ctx, actions).valueOrThrow;
      await expect(
        dispatch({
          type: "BrokenAction",
          payload: { message: "Foo" },
        })
      ).rejects.toThrow("Foo");
      expect(await ctx.repos.eventLog.count()).toEqual(0);
    })
  );

  it(
    "Does not log on failure",
    withContext(async ctx => {
      const dispatch = new Dispatcher(ctx, actions).valueOrThrow;
      await expect(
        dispatch({
          type: "NonValidatingAction",
          payload: { message: "Foo" },
        })
      ).rejects.toThrow(Error);

      expect(await ctx.repos.eventLog.count()).toEqual(0);
    })
  );
  it(
    "Validates result for capturing actions",
    withContext(async ctx => {
      const dispatch = new Dispatcher(ctx, actions).valueOrThrow;
      await expect(
        dispatch({
          type: "CapturingAction",
          payload: { NOFOO: 1 } as any,
        })
      ).rejects.toThrow(Error);

      await expect(
        dispatch({
          type: "CapturingAction",
          payload: { foo: 1 },
        })
      ).resolves.toEqual({});
    })
  );
});
