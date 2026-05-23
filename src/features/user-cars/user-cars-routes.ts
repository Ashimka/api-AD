import { Router } from 'express';

import { authMiddleware } from '~/middleware/auth.js';

import { createCar } from './user-cars-controller.js';

const router = Router();

router.post('/', authMiddleware, createCar);

export { router as userCarsRoutes };
