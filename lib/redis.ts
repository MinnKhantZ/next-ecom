import Redis from 'ioredis';

const globalForRedis = globalThis as unknown as {
  redis: Redis | undefined;
};

// Make Redis optional - only create instance if REDIS_URL is provided
let redis: Redis | null = null;

if (process.env.REDIS_URL) {
  redis = globalForRedis.redis ?? new Redis(process.env.REDIS_URL, {
    maxRetriesPerRequest: 3,
    retryStrategy(times) {
      if (times > 3) {
        console.warn('Redis connection failed after 3 retries. Running without cache.');
        return null; // Stop retrying
      }
      const delay = Math.min(times * 50, 2000);
      return delay;
    },
    lazyConnect: true,
  });

  // Handle connection errors gracefully
  redis.on('error', (err) => {
    console.warn('Redis connection error (running without cache):', err.message);
  });

  // Attempt to connect
  redis.connect().catch((err) => {
    console.warn('Failed to connect to Redis (running without cache):', err.message);
  });

  if (process.env.NODE_ENV !== 'production') globalForRedis.redis = redis;
} else {
  console.info('REDIS_URL not configured. Running without cache.');
}

export { redis };

// Cache helper functions
export const cache = {
  async get<T>(key: string): Promise<T | null> {
    if (!redis) return null;
    try {
      const data = await redis.get(key);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Redis GET error:', error);
      return null;
    }
  },

  async set(key: string, value: any, ttl?: number): Promise<void> {
    if (!redis) return;
    try {
      const serialized = JSON.stringify(value);
      if (ttl) {
        await redis.setex(key, ttl, serialized);
      } else {
        await redis.set(key, serialized);
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
