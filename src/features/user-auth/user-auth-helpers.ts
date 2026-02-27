import type { User } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import { config } from '~/config/index.js';
import { AuthenticationError } from '~/errors/index.js';

type JwtPayload = Pick<User, 'id' | 'email'>;

export async function hashPassword(password: string) {
  return await bcrypt.hash(password, 10);
}

export async function getIsPasswordValid(
  password: string,
  hashedPassword: string,
) {
  return await bcrypt.compare(password, hashedPassword);
}

export function generateJwtToken(user: JwtPayload) {
  const tokenPayload = {
    id: user.id,
    email: user.email,
  };
  const accessToken = jwt.sign(tokenPayload, config.jwtSecret, {
    expiresIn: 60 * 60 * 24 * 30, // 1 месяц
  });
  const refreshToken = jwt.sign(tokenPayload, config.jwtSecret, {
    expiresIn: 60 * 60 * 24 * 365, // 1 год
  });
  return { accessToken, refreshToken };
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
    throw new AuthenticationError('No token found');
  }

  let decoded: unknown;
  try {
    decoded = jwt.verify(token, config.jwtSecret);
  } catch (error) {
    console.error('JWT verification failed:', error);
    throw new AuthenticationError('Invalid or expired token');
  }

  if (isTokenValid(decoded)) {
    return decoded as jwt.JwtPayload;
  }

  throw new AuthenticationError('Invalid token payload');
}

export function refreshAccessToken(refreshToken: string): {
  accessToken: string;
  refreshToken: string;
} {
  let decoded: unknown;
  try {
    decoded = jwt.verify(refreshToken, config.jwtSecret);
  } catch (error) {
    console.error('Refresh token verification failed:', error);
    throw new AuthenticationError('Invalid or expired refresh token');
  }

  if (!isTokenValid(decoded)) {
    throw new AuthenticationError('Invalid refresh token payload');
  }

  const tokenPayload = { id: decoded.id, email: decoded.email };

  const newAccessToken = jwt.sign(tokenPayload, config.jwtSecret, {
    expiresIn: 60 * 60 * 24 * 30, // 1 месяц
  });

  const newRefreshToken = jwt.sign(tokenPayload, config.jwtSecret, {
    expiresIn: 60 * 60 * 24 * 365, // 1 год
  });

  return { accessToken: newAccessToken, refreshToken: newRefreshToken };
}
