import { Router } from 'express';

import { authMiddleware } from '~/middleware/auth.js';

import { createPostCar, updatePostCar } from './cars-post-controller.js';

const router = Router();

router.post('/', authMiddleware, createPostCar);
router.patch('/:id', authMiddleware, updatePostCar);

export { router as carsPostRoutes };
