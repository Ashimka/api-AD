import type { User } from '@prisma/client';

import { prisma } from '~/../lib/prisma.js';
import { AppError } from '~/errors/index.js';
import { throwNormalizedError } from '~/middleware/error-handler.js';

export async function saveUserToDatabase(email: User['email']) {
  try {
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return existingUser;
    }

    const user = await prisma.user.create({
      data: { email },
    });

    if (!user) {
      throw new AppError('Ошибка при авторизации пользователя', 503);
    }

    return user;
  } catch (error) {
    throwNormalizedError(error);
  }
}

export async function retrieveUserFromDatabaseByEmail(email: User['email']) {
  try {
    return await prisma.user.findUnique({
      where: { email },
      select: {
        email: true,
        id: true,
        codeActivate: {
          select: {
            code: true,
            expiresAt: true,
          },
        },
      },
    });
  } catch (error) {
    throwNormalizedError(error);
  }
}

export async function isActivatedUser(email: User['email']) {
  try {
    return await prisma.user.update({
      where: { email },
      data: { isActivated: true },
    });
  } catch (error) {
    throwNormalizedError(error);
  }
}
