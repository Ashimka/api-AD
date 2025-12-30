import dotenv from 'dotenv';

dotenv.config();

export const config = {
  port: process.env.PORT || 4000,
  nodeEnv: process.env.NODE_ENV || 'development',
  jwtSecret: process.env.JWT_SECRET || 'secret',
  cors: {
    origin: process.env.CORS_ORIGIN || '*',
    credentials: true,
  },
} as const;

export type Config = typeof config;
