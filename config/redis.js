const Redis = require('ioredis');

// Create a Redis client and connect to the local Redis server
const redis = new Redis({
  host: '127.0.0.1',   // Localhost
  port: 6379,           // Default Redis port
  password: '',         // Empty if no password is set
  db: 0                 // Redis database number (default is 0)
});


// Test Redis connection
redis.on('connect', () => {
  console.log('Connected to Redis');
});

redis.on('error', (err) => {
  console.error('Redis connection error:', err);
});