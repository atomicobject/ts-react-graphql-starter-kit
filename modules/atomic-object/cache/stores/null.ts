export const NO_CACHE: CacheStore = {
  async get(this: LocalCache, key: string): Promise<string | null> {
    return null;
  },

  async set(
    this: LocalCache,
    key: string,
    value: string,
    ttlMs: number
  ): Promise<any> {
    return;
  },

  async clearValues(pattern: string): Promise<void> {
    return;
  },
};
