import type { User } from '@prisma/client';

import { prisma } from '~/../lib/prisma.js';

export async function saveUserToDatabase(email: User['email']) {
  return prisma.user.upsert({
    where: { email },
    update: {},
    create: { email },
  });
}

export async function retrieveUserFromDatabaseByEmail(email: User['email']) {
  return prisma.user.findUnique({
    where: { email },
    select: {
      email: true,
      id: true,
      codeActivate: {
        select: {
          code: true,
        },
      },
    },
  });
}

export async function isActivatedUser(email: User['email']) {
  return await prisma.user.update({
    where: { email },
    data: { isActivated: true },
  });
}
