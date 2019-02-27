import { addMsToDate, msBetween, sleep } from "./utils";

const SEPARATOR = "\u0000";

export interface Singleton<T> {
  readonly key: string;
  readonly func: () => Promise<T>;
  readonly settings: CacheOpts;
}
export interface Family<A, T> {
  readonly key: string;
  readonly func: (args: A) => Promise<T>;
  readonly subkeyToString: (args: A) => string;
  readonly settings: CacheOpts;
}

export function fromStringableArg<
  A extends string | number | boolean | null | undefined,
  T
>(
  spec: Pick<Family<A, T>, Exclude<keyof Family<A, T>, "subkeyToString">>
): Family<A, T> {
  return Object.assign({}, spec, {
    subkeyToString: String,
  });
}

export class Cache {
  constructor(public readonly store: CacheStore) {}

  get<T>(spec: Singleton<T>): Promise<T>;
  get<A, T, P extends A>(spec: Family<A, T>, args: P): Promise<T>;
  get(spec: any, args?: any): Promise<any> {
    const key = spec.subkeyToString
      ? `${spec.key}:${spec.subkeyToString(args)}`
      : spec.key;
    return rawLookupOrFill(
      this.store,
      key,
      () => spec.func(args),
      spec.settings
    );
  }

  async clear<A, T, P extends A>(spec: Family<A, T>, args?: P): Promise<void> {
    let pattern = args
      ? `${spec.key}:${spec.subkeyToString(args)}*`
      : `${spec.key}*`;

    await this.store.clearValues(pattern);
  }
}

export async function rawLookupOrFill<T>(
  store: CacheStore,
  key: string,
  func: () => Promise<T>,
  settings: CacheOpts
): Promise<T> {
  const cacheKey = key;
  let effectivePayload = await readPayload(store, cacheKey);
  if (effectivePayload) {
    const now = new Date();
    // If the minimum age has expired
    if (now > effectivePayload.nextCheckTime) {
      const ticket = drawTicket();
      const currentAge = msBetween(effectivePayload.createdAt, now);
      const timeUntilEntryIsInvalid = Math.max(
        settings.maxAgeMs - currentAge,
        1
      );

      // Advance minimum age by grace period so other processes don't retry.
      const nextCheckTime = addMsToDate(now, settings.graceMs);

      // Put current value back in cache with a new min age and our ticket.
      await writePayload(
        store,
        cacheKey,
        {
          ticket: ticket,
          createdAt: effectivePayload.createdAt,
          nextCheckTime,
          jsonValue: effectivePayload.jsonValue,
        },
        timeUntilEntryIsInvalid
      );

      // Wait for others to do the same.
      await sleep(25);

      // See what's in the cache
      effectivePayload =
        (await readPayload(store, cacheKey)) || effectivePayload;

      // If our ticket matches what's in redis, then it's our job to recompute the value.
      if (effectivePayload.ticket === ticket) {
        console.log(`Async cache refill for ${cacheKey}`);

        // Don't care about the return value, but avoid errors of unhandled promises
        void fillCache();
        // reuse existing payload
      }
    }
  } else {
    effectivePayload = await fillCache();
  }

  return JSON.parse(effectivePayload.jsonValue);

  async function fillCache(): Promise<Payload> {
    let value = await func();
    if (value === undefined) {
      value = null as any;
    }
    const now = new Date();
    const payload: Payload = {
      createdAt: now,
      nextCheckTime: addMsToDate(now, settings.minAgeMs),
      ticket: -1,
      jsonValue: JSON.stringify(value),
    };
    await writePayload(store, cacheKey, payload, settings.maxAgeMs);
    return payload;
  }
}

export type CacheOpts = {
  minAgeMs: number;
  maxAgeMs: number;
  graceMs: number;
};

function drawTicket() {
  return Math.floor(Math.random() * 2000000000);
}

export interface Payload {
  ticket: number;
  createdAt: Date;
  nextCheckTime: Date;
  jsonValue: string;
}

export function payloadToString(opts: Payload) {
  return [
    opts.ticket.toString(),
    opts.createdAt.valueOf(),
    opts.nextCheckTime.valueOf(),
    opts.jsonValue,
  ].join(SEPARATOR);
}

export function stringToPayload(cacheString: string): Payload | null {
  const entries = cacheString.split(SEPARATOR);
  if (entries.length !== 4) {
    return null;
  }

  const [winner, createdAt, nextCheckTime, jsonValue] = entries;
  return {
    ticket: parseInt(winner, 10),
    createdAt: new Date(parseInt(createdAt, 10)),
    nextCheckTime: new Date(parseInt(nextCheckTime, 10)),
    jsonValue: jsonValue,
  };
}

export async function readPayload(
  store: CacheStore,
  key: string
): Promise<Payload | null> {
  const cacheString: string | null = await store.get(key);
  const payload =
    cacheString === null || cacheString === undefined
      ? null
      : stringToPayload(cacheString);
  return payload;
}

export async function writePayload(
  store: CacheStore,
  key: string,
  payload: Payload,
  ttlMs: number
): Promise<any> {
  await store.set(key, payloadToString(payload), ttlMs);
}
