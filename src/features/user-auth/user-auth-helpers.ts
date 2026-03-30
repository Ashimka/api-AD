import type { User } from '@prisma/client';
import bcrypt from 'bcrypt';
import type { Request } from 'express';
import jwt from 'jsonwebtoken';

import { config } from '~/config/index.js';
import { AuthenticationError } from '~/errors/index.js';

type JwtPayload = Pick<User, 'id' | 'email'>;
type TokenType = 'access' | 'refresh';
type JwtTokenPayload = JwtPayload & { tokenType: TokenType };

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
  const basePayload = {
    id: user.id,
    email: user.email,
  };
  const accessToken = jwt.sign(
    { ...basePayload, tokenType: 'access' as const },
    config.jwtSecret,
    {
      expiresIn: '10m', // 10 минут
    },
  );
  const refreshToken = jwt.sign(
    { ...basePayload, tokenType: 'refresh' as const },
    config.jwtSecret,
    {
      expiresIn: 60 * 60 * 24 * 30, // 1 месяц
    },
  );
  return { accessToken, refreshToken };
}

const isTokenValid = (token: unknown): token is JwtTokenPayload => {
  if (
    typeof token === 'object' &&
    token !== null &&
    'id' in token &&
    'email' in token &&
    'tokenType' in token &&
    (token.tokenType === 'access' || token.tokenType === 'refresh')
  ) {
    return true;
  }

  return false;
};

const isTokenType = (
  token: JwtTokenPayload,
  tokenType: TokenType,
): token is JwtTokenPayload & { tokenType: typeof tokenType } => {
  return token.tokenType === tokenType;
};

export function getJwtTokenFromHeaders(request: Request): jwt.JwtPayload {
  const header = request.headers.authorization;
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

  if (isTokenValid(decoded) && isTokenType(decoded, 'access')) {
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

  if (!isTokenValid(decoded) || !isTokenType(decoded, 'refresh')) {
    throw new AuthenticationError('Invalid refresh token payload');
  }

  const basePayload = { id: decoded.id, email: decoded.email };

  const newAccessToken = jwt.sign(
    { ...basePayload, tokenType: 'access' as const },
    config.jwtSecret,
    {
      expiresIn: '10m', // 10 минут
    },
  );

  const newRefreshToken = jwt.sign(
    { ...basePayload, tokenType: 'refresh' as const },
    config.jwtSecret,
    {
      expiresIn: 60 * 60 * 24 * 30, // 1 месяц
    },
  );

  return { accessToken: newAccessToken, refreshToken: newRefreshToken };
}
