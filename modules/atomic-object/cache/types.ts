interface CacheStore {
  get(key: string): Promise<string | null>;
  set(key: string, value: string, ttlMs: number): Promise<string | null>;
  clearValues(pattern: string): Promise<void>;
}

interface LocalCache extends CacheStore {
  map: Map<
    string,
    {
      expiration: Date;
      value: string;
    }
  >;

  reset(): void;
  expirationTime(key: string): Date | null;
}
