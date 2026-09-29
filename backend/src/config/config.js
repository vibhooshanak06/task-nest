require('dotenv').config();

const config = {
  port: process.env.PORT || 5000,
  databaseUrl: process.env.DATABASE_URL,
  jwtSecret: process.env.JWT_SECRET || 'fallback_secret_change_in_production',
  nodeEnv: process.env.NODE_ENV || 'development',
  bcryptRounds: 10,
  jwtExpiresIn: '7d',
};

module.exports = config;
