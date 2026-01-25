import { Router } from 'express';

import { signInOrCreateUser } from './user-auth-controller.js';

const router = Router();

router.post('/email', signInOrCreateUser);

export { router as userAuthRoutes };
