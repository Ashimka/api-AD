import { Router } from 'express';

import { register } from './user-auth-controller.js';

const router = Router();

router.post('/register', register);

export { router as userAuthRoutes };
