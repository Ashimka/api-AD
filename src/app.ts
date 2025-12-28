import cors from 'cors';
import express from 'express';

import { config } from './config/index.js';

export function buildApp() {
  const app = express();

  app.use(express.json());
  app.use(cors(config.cors));

  return app;
}
