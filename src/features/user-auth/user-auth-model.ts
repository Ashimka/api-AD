import type { AuthCode } from '~/../generated/prisma/client.ts';
import { prisma } from '~/../lib/prisma.js';

export async function saveAuthCodeToDatabase(
  code: string,
  userId: AuthCode['userId'],
) {
  return await prisma.authCode.create({
    data: {
      code,
      userId,
      expiresAt: new Date(Date.now() + 5 * 60 * 1000), // Код истекает через 5 минут
    },
  });
}
