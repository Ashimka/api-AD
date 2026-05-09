import type { AuthCode } from '@prisma/client';

import { prisma } from '~/../lib/prisma.js';
import { AppError } from '~/errors/index.js';
import { throwNormalizedError } from '~/middleware/error-handler.js';

export async function saveAuthCodeToDatabase(
  code: string,
  userId: AuthCode['userId'],
) {
  try {
    const result = await prisma.authCode.upsert({
      where: { userId },
      update: {
        code,
        expiresAt: new Date(Date.now() + 5 * 60 * 1000),
      },
      create: {
        code,
        userId,
        expiresAt: new Date(Date.now() + 5 * 60 * 1000),
      },
    });

    if (!result) {
      throw new AppError(
        'Не удалось создать или найти код авторизации в базе данных',
        503,
      );
    }

    return result;
  } catch (error) {
    throwNormalizedError(error);
  }
}

export async function incrementAuthAttempts(userId: AuthCode['userId']) {
  try {
    return await prisma.authCode.update({
      where: { userId },
      data: { attempts: { increment: 1 } },
      select: { attempts: true },
    });
  } catch (error) {
    throwNormalizedError(error);
  }
}

export async function resetAuthAttempts(userId: AuthCode['userId']) {
  try {
    return await prisma.authCode.update({
      where: { userId },
      data: { attempts: 0 },
    });
  } catch (error) {
    throwNormalizedError(error);
  }
}
