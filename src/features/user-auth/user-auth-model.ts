import type { AuthCode } from '@prisma/client';

import { prisma } from '~/../lib/prisma.js';

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

    return result;
  } catch (error) {
    console.error('Database error in saveAuthCodeToDatabase:', error);

    throw error;
  }
}

export async function incrementAuthAttempts(userId: AuthCode['userId']) {
  return await prisma.authCode.update({
    where: { userId },
    data: { attempts: { increment: 1 } },
    select: { attempts: true },
  });
}

export async function resetAuthAttempts(userId: AuthCode['userId']) {
  return prisma.authCode.update({
    where: { userId },
    data: { attempts: 0 },
  });
}
