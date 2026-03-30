import type { NextFunction, Request, Response } from 'express';

import { getJwtTokenFromHeaders } from '~/features/user-auth/user-auth-helpers.js';

export function authMiddleware(
  request: Request,
  _response: Response,
  next: NextFunction,
) {
  getJwtTokenFromHeaders(request);
  next();
}
