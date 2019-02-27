import { Context } from "graphql-api/context";
import { Flavor } from "helpers";
import * as bull from "bull";

export type Queues = "main"; // | 'more' | 'queues'
export type JobProcessFunction<TData> = (args: {
  ctx: Context;
  payload: TData;
  job: bull.Job<StandardJobData<TData>>;
}) => Promise<any>;

export type StandardJobData<TData> = { type: string; payload: TData };
export type StandardJob<TData = unknown> = bull.Job<StandardJobData<TData>>;

export interface JobSpec<TData = any, TIdentifier extends string = string> {
  readonly identifier: TIdentifier;
  process: JobProcessFunction<TData>;
  queue: Queues;
}

type JobArgs<TData, TIdentifier extends string> = {
  identifier: TIdentifier;
  process: JobProcessFunction<TData>;
  queue?: Queues;
};
export function declare<TData, TIdentifier extends string>(
  args: JobArgs<TData, TIdentifier>
): JobSpec<TData, TIdentifier> {
  return {
    identifier: args.identifier,
    process: args.process,
    queue: args.queue || "main",
  };
}

export function processWithContext<TData>(
  process: JobProcessFunction<TData>
): JobProcessFunction<TData> {
  return process;
}

export type JobId = Flavor<string, "A bull job ID">;
