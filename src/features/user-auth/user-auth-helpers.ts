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

const isTokenValid = (token: jwt.JwtPayload | string) => {
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

export function getJwtTokenFromHeaders(request: Request) {
  const token = request.headers.get('Authorization')?.split(' ')[1];

  if (!token) {
    throw new Error('No token found');
  }

  const decodedToken = jwt.verify(token, config.jwtSecret);

  if (isTokenValid(decodedToken)) {
    return decodedToken;
  }

  throw new Error('Invalid token payload');
}
