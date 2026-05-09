import { Router } from 'express';

import { userAuthRoutes } from './features/user-auth/user-auth-routes.js';
import { userCarsRoutes } from './features/user-cars/user-cars-routes.js';
import { authDbMiddleware } from './middleware/auth-db.js';

const apiRouter = Router();

apiRouter.use('/auth', authDbMiddleware, userAuthRoutes);
apiRouter.use('/cars', userCarsRoutes);

export { apiRouter };
