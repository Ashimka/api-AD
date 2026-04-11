import { Router } from 'express';

import { userAuthRoutes } from './features/user-auth/user-auth-routes.js';
import { userCarsRoutes } from './features/user-cars/user-cars-routes.js';

const apiRouter = Router();

apiRouter.use('/auth', userAuthRoutes);
apiRouter.use('/cars', userCarsRoutes);

export { apiRouter };
