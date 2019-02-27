import { Context } from "graphql-api/context";
import { Job } from "bull";
import { JobSpec } from "atomic-object/jobs";

export function makeJobProcessorFunction(args: {
  buildContext: () => Context;
  jobs: JobSpec[];
}): (job: Job) => Promise<any> {
  const { buildContext, jobs } = args;
  const jobMap: Map<string, JobSpec> = new Map();
  for (const job of jobs) {
    jobMap.set(job.identifier, job);
  }
  return async (job: Job) => {
    const ctx = buildContext();
    try {
      const spec = jobMap.get(job.data.type);
      if (!spec) {
        throw new Error(
          `Didn't know how to process job of type ${job.data.type}`
        );
      }
      await spec.process({ payload: job.data.payload, ctx, job });
    } finally {
      await ctx.destroy();
    }
  };
}
