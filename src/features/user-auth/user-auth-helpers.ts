import jwt from 'jsonwebtoken';

import type { User } from '~/../generated/prisma/client.js';
import { config } from '~/config/index.js';

export function generateJwtToken(user: User) {
  const tokenPayload = {
    id: user.id,
    email: user.email,
  };
  return jwt.sign(tokenPayload, config.jwtSecret, {
    expiresIn: 60 * 60 * 24 * 365, // 1 год
  });
}

const isTokenValid = (token: unknown): token is jwt.JwtPayload => {
  if (
    typeof token === 'object' &&
    token !== null &&
    'id' in token &&
    'email' in token
  ) {
    return true;
  }

  return false;
};

export function getJwtTokenFromHeaders(request: Request): jwt.JwtPayload {
  const header = request.headers.get('Authorization');
  const token = header?.split(' ')[1];

  if (!token) {
    throw new Error('No token found');
  }

  let decoded: unknown;
  try {
    decoded = jwt.verify(token, config.jwtSecret);
  } catch (error) {
    console.error('JWT verification failed:', error);
    throw new Error('Invalid or expired token');
  }

  if (isTokenValid(decoded)) {
    return decoded as jwt.JwtPayload;
  }

  throw new Error('Invalid token payload');
}
