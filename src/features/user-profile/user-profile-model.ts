import type { User } from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/client';

import { prisma } from '~/../lib/prisma.js';

export async function saveUserToDatabase(email: User['email']) {
  try {
    const user = await prisma.user.upsert({
      where: { email },
      update: {},
      create: { email },
    });

    if (!user) {
      throw new Error(
        'Не удалось создать или найти пользователя в базе данных',
      );
    }

    return user;
  } catch (error) {
    if (
      error instanceof PrismaClientKnownRequestError &&
      error.code === 'ECONNREFUSED'
    ) {
      console.log('Ошибка подключения к базе данных');
    }
  }
}

export async function retrieveUserFromDatabaseByEmail(email: User['email']) {
  try {
    const user = await prisma.user.findUnique({
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

    if (!user) {
      throw new Error(
        'Не удалось создать или найти пользователя в базе данных',
      );
    }

    return user;
  } catch (error) {
    if (
      error instanceof PrismaClientKnownRequestError &&
      error.code === 'ECONNREFUSED'
    ) {
      console.log('Ошибка подключения к базе данных');
    }
  }
}

export async function isActivatedUser(email: User['email']) {
  return await prisma.user.update({
    where: { email },
    data: { isActivated: true },
  });
}
