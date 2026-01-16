import Redis from "ioredis";
import logger from "./logger";

const globalForRedis = global as unknown as {
  redis: Redis;
};

/**
 * Creates a Redis client and sets up error handling.
 * 
 * We use Redis to store queries for 3 days.
 * This enables us to store query state in the URL,
 * which is suitable for server-rendered applications.
 * 
 * @returns Redis client
 */
const createRedisClient = (): Redis => {
  const client = new Redis(process.env.REDIS_URL || "redis://localhost:6379", {
    maxRetriesPerRequest: 3,
    retryStrategy(times) {
      const delay = Math.min(times * 50, 2000);
      return delay;
    },
    reconnectOnError(err) {
      const targetErrors = ["READONLY", "ECONNRESET"];
      return targetErrors.some((e) => err.message.includes(e));
    },
  });

  client.on("error", (err) => {
    logger.error({ err }, "Redis connection error");
  });

  client.on("connect", () => {
    logger.info("Redis connected");
  });

  return client;
}

const redis = globalForRedis.redis || createRedisClient();

if (process.env.NODE_ENV !== "production") globalForRedis.redis = redis;

export default redis;