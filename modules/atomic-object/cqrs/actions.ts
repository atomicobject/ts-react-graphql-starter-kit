import * as Jobs from "atomic-object/jobs";
import { IsolationLevel } from "atomic-object/records";
import { Omit } from "helpers";
import { JsonMap } from "helpers/json";
import { flatMap } from "lodash-es";
import { Repositories } from "records";

export type ActionCommon<TPayload, TJobPayload extends TPayload = TPayload> = {
  schema: JsonMap;
  isolationLevel: IsolationLevel;
  backgroundJob?: Jobs.JobSpec<TJobPayload>;
};

/** An action with an instantaneous effect which does not have outcome data to capture */
export type UncapturedActionDesc<K extends string, T, R> = {
  type: K;
  handler: (payload: T, extra: { repos: Repositories }) => Promise<R>;
  handleAndCaptureEffect?: never;
} & ActionCommon<T>;

/** An action with no instantaneous effect. May have a background effect */
export type VoidEffectActionDesc<K extends string, T> = {
  type: K;
  handler?: never;
  handleAndCaptureEffect?: never;
} & Omit<ActionCommon<T>, "isolationLevel">;

/** An action that has an instantaneous effect which also captures outcome info */
export type CapturedActionDesc<K extends string, T, R, C = unknown> = {
  type: K;
  handler?: never;
  handleAndCaptureEffect: (
    payload: T,
    extra: { repos: Repositories }
  ) => Promise<[R, C]>;
} & ActionCommon<T>;

export type Action<
  K extends string = any,
  T = any,
  R = unknown,
  C = unknown
> = {
  type: K;
  handler:
    | null
    | ((
        payload: T,
        extra: { repos: Repositories; capture: (v: C) => Promise<void> }
      ) => Promise<R>);
  schema: JsonMap;
  isolationLevel: IsolationLevel;
  backgroundJob: Jobs.JobSpec<T> | null;
};

export function declareAction<K extends string, T>(
  action: VoidEffectActionDesc<K, T>
): Action<K, T, void, void>;

export function declareAction<K extends string, T, R>(
  action: UncapturedActionDesc<K, T, R>
): Action<K, T, R, void>;

export function declareAction<K extends string, T, R, C>(
  action: CapturedActionDesc<K, T, R, C>
): Action<K, T, R, C>;

export function declareAction<K extends string, T, R, C>(
  action:
    | UncapturedActionDesc<K, T, R>
    | CapturedActionDesc<K, T, R, C>
    | VoidEffectActionDesc<K, T>
): Action<K, T, R, C> {
  const isolationLevel =
    "isolationLevel" in action ? action.isolationLevel : "READ COMMITTED";
  if ("handleAndCaptureEffect" in action) {
    return declareAction({
      type: action.type,
      schema: action.schema,
      isolationLevel,
      backgroundJob: action.backgroundJob,
      handler: async (payload: any, { repos, capture }: any) => {
        const [result, captured] = await action.handleAndCaptureEffect!(
          payload,
          {
            repos,
          }
        );
        await capture(captured);
        return result;
      },
    }) as any;
  }
  return {
    ...action,
    isolationLevel,
    handler: "handler" in action ? action.handler || null : null,
    backgroundJob: action.backgroundJob || null,
  };
}

export class Actions<TActions extends Action<any, any, any, any> = never> {
  constructor(public actions: ReadonlyArray<TActions> = []) {}

  get backgroundJobs(): Jobs.JobSpec[] {
    return flatMap(this.actions, act =>
      act.backgroundJob ? [act.backgroundJob] : []
    );
  }

  forType(type: TActions["type"]) {
    const action = this.actions.find(a => a.type === type);
    if (!action) {
      throw new Error(`Unknown action type ${type}`);
    }
    return action;
  }

  with<K extends string, T, R, C>(
    action: Action<K, T, R, C>
  ): this extends Actions<never>
    ? Actions<Action<K, T, R, C>>
    : Actions<TActions | Action<K, T, R, C>> {
    return new Actions([...this.actions, action]) as any;
  }

  withAll<TActions2 extends Action<any, any, any, any>>(
    actions: Actions<TActions2>
  ): this extends Actions<never>
    ? Actions<TActions2>
    : Actions<TActions | TActions2> {
    return new Actions([...this.actions, ...actions.actions]) as any;
  }
}

export type ActionObjectTypes<TAction extends Action> = TAction extends Action<
  infer K,
  infer P,
  any,
  any
>
  ? { type: K; payload: P }
  : never;

export type ActionsObjectTypes<
  TActions extends Actions<any>
> = TActions extends Actions<infer TActionTypes>
  ? ActionObjectTypes<TActionTypes>
  : never;

export type UnwrapActions<
  TActions extends Actions<any>
> = TActions extends Actions<infer TA> ? TA : never;
