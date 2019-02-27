import * as Bull from "bull";
import * as Job from "atomic-object/jobs";
import { Context } from "graphql-api/context";
import { makeJobProcessorFunction } from "./processing-function";
import * as config from "config";

type Queues = Job.Queues;

const notConcurrent = <T>(proc: () => PromiseLike<T>) => {
  let inFlight: Promise<T> | false = false;

  return () => {
    if (!inFlight) {
      inFlight = (async () => {
        try {
          return await proc();
        } finally {
          inFlight = false;
        }
      })();
    }
    return inFlight;
  };
};

export class JobRunner {
  _drainer: null | ((queue: Queues) => void);

  _queues: Map<Queues, Bull.Queue>;

  _registeredJobs: Set<Job.JobSpec>;
  _isSetup: boolean;
  private readonly buildContext: () => Context;

  constructor(private readonly prefix: string, buildContext?: () => Context) {
    this.buildContext =
      buildContext ||
      (() => {
        throw new Error("execution not supported");
      });
    this._drainer = null;
    this._isSetup = false;

    this._queues = new Map<Queues, Bull.Queue>([
      [
        "main",
        new Bull("main", {
          prefix,
          redis: config.get("redis.url"),
        }),
      ],
    ]);

    this._registeredJobs = new Set();
  }

  _setup = notConcurrent(async () => {
    if (process.env.NODE_ENV !== "test") {
      throw new Error();
    }
    if (this._isSetup) return;
    this._isSetup = true;

    for (const [qname, queue] of this._queues.entries()) {
      await queue.pause();

      const processFn = makeJobProcessorFunction({
        buildContext: this.buildContext,
        jobs: Array.from(this._registeredJobs.keys()),
      });
      void queue.process(processFn);

      queue.on("drained", this._onDrained.bind(this, qname));
    }
  });

  private _onDrained = (queue: Queues) => {
    if (this._drainer) this._drainer(queue);
  };

  register(...specs: Job.JobSpec[]) {
    if (this._isSetup) {
      throw new Error("Can't register jobs after starting");
    }

    for (const job of specs) {
      this._registeredJobs.add(job);
    }
  }

  async enqueue<TData, TIdentifier extends string, TArg extends TData>(
    spec: Job.JobSpec<TData, TIdentifier>,
    data: TArg
  ): Promise<Job.JobId> {
    const queue = this._queues.get(spec.queue)!;

    const jobData: Job.StandardJobData<TArg> = {
      type: spec.identifier,
      payload: data,
    };
    const bullJob = await queue.add(jobData);
    return bullJob.id as any;
  }

  async getJob<TData, TIdentifier extends string>(
    spec: Job.JobSpec<TData, TIdentifier>,
    id: Job.JobId
  ): Promise<Job.StandardJob<TData>> {
    const queue = this._queues.get(spec.queue)!;
    return (await queue.getJob(id))!;
  }

  async start() {
    await this._setup();

    for (const [name, queue] of this._queues.entries()) {
      await queue.resume();
    }
  }

  async stop() {
    for (const queue of this._queues.values()) {
      await queue.pause();
    }
  }

  async runAll(ignoreEmpty = false) {
    await this._setup();

    const queuesToWait = new Set<Queues>();
    for (const [name, queue] of this._queues.entries()) {
      let counts = await queue.getJobCounts();
      let jobCount = counts.waiting + counts.active + (counts as any).paused;

      if (jobCount > 0) {
        queuesToWait.add(name);
      }
    }

    if (queuesToWait.size === 0) {
      if (ignoreEmpty) {
        return;
      } else {
        throw new Error("Bad news: no jobs (Did you forget to await?)");
      }
    }

    const drainPromise = new Promise((resolve, reject) => {
      this._drainer = async q => {
        queuesToWait.delete(q);
        await this._queues.get(q)!.pause();

        if (queuesToWait.size === 0) {
          await this.stop();
          this._drainer = null;
          resolve();
        }
      };
    });
    void this.start();
    await drainPromise;
  }

  async close() {
    for (const [name, queue] of this._queues.entries()) {
      await queue.empty();
      await queue.close();
    }
  }
}

export interface JobQueuer
  extends Pick<JobRunner, Exclude<keyof JobRunner, "start" | "stop">> {}
