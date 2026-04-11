import { Router } from 'express';
import { createCar } from './user-cars-controller.js';
import { authMiddleware } from '~/middleware/auth.js';

const router = Router();

router.post('/', authMiddleware, createCar);

export { router as userCarsRoutes };
