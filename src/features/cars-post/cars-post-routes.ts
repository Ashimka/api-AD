import { Router } from 'express';

import { authMiddleware } from '~/middleware/auth.js';

import {
  createPostCar,
  deletePostCar,
  getAllPostCar,
  updatePostCar,
} from './cars-post-controller.js';

const router = Router();

router.post('/', authMiddleware, createPostCar);
router.patch('/:id', authMiddleware, updatePostCar);
router.get('/', authMiddleware, getAllPostCar);
router.delete('/:postId', authMiddleware, deletePostCar);

export { router as carsPostRoutes };
