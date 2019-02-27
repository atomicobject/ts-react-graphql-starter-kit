import { sleep, addMsToDate } from "../utils";

export const LOCAL_CACHE: LocalCache = {
  map: new Map(),

  reset(this: LocalCache) {
    this.map = new Map();
  },

  expirationTime(this: LocalCache, key: string): Date | null {
    const entry = this.map.get(key);
    return entry ? entry.expiration : null;
  },

  async get(this: LocalCache, key: string): Promise<string | null> {
    await sleep(Math.random() * 15);
    const cacheValue = this.map.get(key);
    if (cacheValue && new Date() < cacheValue.expiration) {
      return cacheValue.value;
    } else {
      return null;
    }
  },

  async set(
    this: LocalCache,
    key: string,
    value: string,
    ttlMs: number
  ): Promise<any> {
    await sleep(Math.random() * 15);

    this.map.set(key, {
      value,
      expiration: addMsToDate(new Date(), ttlMs),
    });
  },

  async clearValues(pattern: string): Promise<void> {
    const allKeys = Array.from(this.map.keys());
    const noWildcardPattern = pattern.replace("*", "");
    const matchingKeys = allKeys.filter(k => k.startsWith(noWildcardPattern));
    matchingKeys.forEach(k => this.map.delete(k));
  },
};
