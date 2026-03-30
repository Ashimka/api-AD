import { Router } from 'express';

import {
  getRefreshAccessToken,
  signInOrCreateUser,
  verifyEmailCode,
} from './user-auth-controller.js';

const router = Router();

router.post('/email', signInOrCreateUser);
router.post('/verify-code', verifyEmailCode);
router.post('/refresh', getRefreshAccessToken);

export { router as userAuthRoutes };
