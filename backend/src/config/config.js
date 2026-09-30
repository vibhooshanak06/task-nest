require('dotenv').config();

const config = {
  port: process.env.PORT || 5000,
  db: {
    host:     process.env.DB_HOST     || 'localhost',
    port:     parseInt(process.env.DB_PORT || '3306', 10),
    name:     process.env.DB_NAME     || 'tasknest',
    user:     process.env.DB_USER     || 'root',
    password: process.env.DB_PASSWORD || '',
  },
  jwtSecret:  process.env.JWT_SECRET || 'fallback_secret_change_in_production',
  nodeEnv:    process.env.NODE_ENV   || 'development',
  bcryptRounds: 10,
  jwtExpiresIn: '7d',
};

module.exports = config;
