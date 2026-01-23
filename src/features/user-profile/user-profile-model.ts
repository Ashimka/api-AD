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
  });
}
