import { Router } from 'express';

import { userAuthRoutes } from './features/user-auth/user-auth-routes.js';

const apiRouter = Router();

apiRouter.use('/auth', userAuthRoutes);

export { apiRouter };
