import { Router } from 'express';

import { authMiddleware } from '~/middleware/auth.js';

import { createPostCar } from './cars-post-controller.js';

const router = Router();

router.post('/', authMiddleware, createPostCar);

export { router as carsPostRoutes };
