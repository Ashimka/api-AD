import cors from 'cors';
import express from 'express';

import { errorHandler } from '~/middleware/error-handler.js';
import { apiRouter } from '~/routes.js';

import { config } from './config/index.js';

export function buildApp() {
  const app = express();

  app.use(express.json());
  app.use(cors(config.cors));

  app.use('/api', apiRouter);

  app.use(errorHandler);

  return app;
}
