import { Redis } from '@upstash/redis';

// Make Redis optional - only create instance if environment variables are provided
let redis: Redis | null = null;

if (process.env.REDIS_KV_REST_API_URL && process.env.REDIS_KV_REST_API_TOKEN) {
  redis = new Redis({
    url: process.env.REDIS_KV_REST_API_URL,
    token: process.env.REDIS_KV_REST_API_TOKEN,
  });
} else {
  console.info('Upstash Redis environment variables not configured. Running without cache.');
}

export { redis };

// Cache helper functions
export const cache = {
  async get<T>(key: string): Promise<T | null> {
    if (!redis) return null;
    try {
      return await redis.get<T>(key);
    } catch (error) {
      console.error('Redis GET error:', error);
      return null;
    }
  },

  async set(key: string, value: any, ttl?: number): Promise<void> {
    if (!redis) return;
    try {
      if (ttl) {
        await redis.set(key, value, { ex: ttl });
      } else {
        await redis.set(key, value);
      }
    } catch (error) {
      console.error('Redis SET error:', error);
    }
  },

  async del(key: string): Promise<void> {
    if (!redis) return;
    try {
      await redis.del(key);
    } catch (error) {
      console.error('Redis DEL error:', error);
    }
  },

  async delPattern(pattern: string): Promise<void> {
    if (!redis) return;
    try {
      // Note: Upstash Redis keys command exists but scan is safer for large datasets.
      // However, for simplicity and matching previous behavior:
      const keys = await redis.keys(pattern);
      if (keys.length > 0) {
        await redis.del(...keys);
      }
    } catch (error) {
      console.error('Redis DEL PATTERN error:', error);
    }
  },
};

export default redis;
