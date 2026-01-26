import { Router } from 'express';

import { signInOrCreateUser, verifyEmailCode } from './user-auth-controller.js';

const router = Router();

router.post('/email', signInOrCreateUser);
router.post('/verify-code', verifyEmailCode);

export { router as userAuthRoutes };
