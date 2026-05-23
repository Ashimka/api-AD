import { Router } from 'express';

import { carsPostRoutes } from './features/cars-post/cars-post-routes.js';
import { userAuthRoutes } from './features/user-auth/user-auth-routes.js';
import { userCarsRoutes } from './features/user-cars/user-cars-routes.js';
import { authDbMiddleware } from './middleware/auth-db.js';

const apiRouter = Router();

apiRouter.use('/auth', authDbMiddleware, userAuthRoutes);
apiRouter.use('/cars', authDbMiddleware, userCarsRoutes);
apiRouter.use('/post', authDbMiddleware, carsPostRoutes);

export { apiRouter };
