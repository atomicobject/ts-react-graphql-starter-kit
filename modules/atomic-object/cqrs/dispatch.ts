import { Actions, Action, UnwrapActions } from "./actions";
import { Context } from "graphql-api/context";
import * as config from "config";

import * as Result from "atomic-object/result";

import * as Ajv from "ajv";
import { UnsavedEventLog, SavedEventLog } from "records/event-log";
import { JobId } from "atomic-object/jobs";
import { buildAjv, SchemaError } from "core/schemas";

type DispatchResult<T> = {
  value: T;
  backgroundJobId: null | JobId;
  event: SavedEventLog;
};
/** Wrapper for AJV errors that subclass Error to work with result type */

export class Dispatcher<TActions extends Action<any, any, any>> {
  schemaCache: Map<Action<any, any, any, unknown>, Ajv.ValidateFunction>;
  ajv: Ajv.Ajv;
  constructor(
    private rootContext: Context,
    private actions: Actions<TActions>
  ) {
    this.ajv = buildAjv({ jsonPointers: true, allErrors: false });
    this.schemaCache = new Map<Action<any, any, any>, Ajv.ValidateFunction>();
    for (const action of this.actions.actions) {
      this.ajv.addSchema(action.schema, action.type);
    }
  }

  private _validatorFor(action: TActions): Ajv.ValidateFunction {
    const validator = this.ajv.getSchema(action.type);
    return validator;
  }

  private _captureValidatorFor(action: TActions): Ajv.ValidateFunction {
    let validator = this.schemaCache.get(action);
    if (validator) {
      return validator;
    }

    validator = this.ajv.compile({
      $ref: `${action.type}#/definitions/effect`,
    });
    this.schemaCache.set(action, validator);
    return validator;
  }

  orThrow = async <K extends TActions["type"]>(arg: {
    type: K;
    payload: TActions extends Action<K, infer P, any> ? P : never;
  }): Promise<
    TActions extends Action<K, any, infer R> ? DispatchResult<R> : never
  > => {
    let payload = arg.payload;

    if (config.get("test")) {
      payload = JSON.parse(JSON.stringify(payload));
    }

    const action = this.actions.forType(arg.type);
    const validate = this._validatorFor(action);

    if (!validate(payload)) {
      throw new SchemaError(validate.errors![0]);
    }

    if (!action) {
      throw new Error(`Bad action type ${arg.type}`);
    }

    return this.rootContext.repos.transaction(async repos => {
      let record: UnsavedEventLog;
      let result: any;
      if (action.handler) {
        let captured: any = null;
        const capture = async (a: any) => {
          const validate = this._captureValidatorFor(action);
          if (validate(a)) {
            captured = a;
          } else {
            throw new SchemaError(validate.errors![0]);
          }
        };
        result = await action.handler(arg.payload, { repos, capture });
        record = {
          ...arg,
          payload: {
            ...arg.payload,
          },
          effect: captured,
        };
      } else {
        record = { ...arg, effect: null };
        result = undefined;
      }

      let jobId: JobId | null = null;
      if (action.backgroundJob) {
        jobId = await this.rootContext.jobs.enqueue(
          action.backgroundJob,
          arg.payload
        );
        record.effect = record.effect || {};
        record.effect.backgroundJobId = jobId;
      }
      const event = await repos.eventLog.insert(record);
      const ret: DispatchResult<any> = {
        backgroundJobId: jobId,
        event,
        value: result,
      };
      return ret;
    });
  };

  valueOrThrow = async <K extends TActions["type"]>(arg: {
    type: K;
    payload: TActions extends Action<K, infer P, any> ? P : never;
  }): Promise<TActions extends Action<K, any, infer R> ? R : never> => {
    const res = await this.orThrow(arg as any);
    return res.value;
  };

  toResult = async <K extends TActions["type"]>(arg: {
    type: K;
    payload: TActions extends Action<K, infer P, any> ? P : never;
  }): Promise<
    TActions extends Action<K, any, infer R>
      ? Result.Type<DispatchResult<R>>
      : never
  > => {
    try {
      return (await this.orThrow(arg as any)) as any;
    } catch (e) {
      return e;
    }
  };
}

export type DispatcherFn<TActions extends Actions<any>> = Dispatcher<
  UnwrapActions<TActions>
>["orThrow"];
