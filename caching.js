const redis = require("redis");
const REDIS_HOST = process.env.REDIS_HOST || "localhost";
const REDIS_PORT = process.env.REDIS_PORT || 6379;
const client = redis.createClient({
    host: REDIS_HOST,
    port: REDIS_PORT,
});

export const cache = async (req, res, next) => {
  const { trackingNumber } = req.body;
  await connect();
  let result = await getCachedValue(trackingNumber);
  if (result) {
    return res.status(200).json({status: result});
  } else {
    next();
  }
};

export const cacheValue = async (key, seconds, value) => {
  await client.setEx(key, seconds, value);
};

export const getCachedValue = async (key) => {
    await connect();
    let value = await client.get(key);
    return value;
};

export const connect = async () => {
  if (!client.isOpen) {
    await client.connect();
  }
};
