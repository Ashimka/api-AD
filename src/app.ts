import cors from 'cors';
import express from 'express';

import { apiRouter } from '~/routes.js';

import { config } from './config/index.js';

export function buildApp() {
  const app = express();

  app.use(express.json());
  app.use(cors(config.cors));

  app.use('/api', apiRouter);

  return app;
}
