import { JobRunner } from "atomic-object/jobs/mapping";
import { Context, ContextOpts } from "graphql-api/context";
import * as config from "config";

const jobRunner = new JobRunner(config.get("redis.prefix"));

export function buildContext(opts: ContextOpts = {}) {
  return new Context({
    jobs: jobRunner,
    ...opts,
  });
}
