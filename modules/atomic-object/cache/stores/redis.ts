import * as zlib from "zlib";
import { getRedisConnection } from "db/redis";

export class RedisCacheStore implements CacheStore {
  constructor(public readonly keyPrefix: string) {}

  async get(key: string): Promise<string | null> {
    key = `${this.keyPrefix}${key}`;
    const redis = getRedisConnection();
    const cacheString: Buffer | null = await redis.getBuffer(key);
    if (!cacheString) {
      return cacheString;
    }
    return new Promise<string | null>((resolve, reject) => {
      zlib.gunzip(cacheString, (err, res) => {
        if (err) {
          resolve(null);
        } else {
          resolve(res.toString("utf8"));
        }
      });
    });
  }

  async set(key: string, value: string, ttlMs: number): Promise<any> {
    key = `${this.keyPrefix}${key}`;
    const redis = getRedisConnection();
    return new Promise<string | null>((resolve, reject) => {
      zlib.gzip(value, async (err, compressed) => {
        if (err) {
          reject(err);
          return;
        }

        try {
          await redis.set(key, compressed, "px", ttlMs);
          resolve();
        } catch (e) {
          reject(e);
          return;
        }
      });
    });
  }

  async clearValues(pattern: string): Promise<void> {
    pattern = `${this.keyPrefix}${pattern}`;
    const redis = getRedisConnection();
    const keys = await redis.keys(pattern);
    if (keys.length > 0) {
      await redis.del(...keys);
    }
  }
}
