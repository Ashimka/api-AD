import type { Prisma, User } from '~/../generated/prisma/client.ts';
import { prisma } from '~/../lib/prisma.js';

export async function saveUserToDatabase(user: Prisma.UserCreateInput) {
  return prisma.user.create({
    data: user,
  });
}

export async function retrieveUserFromDatabaseByEmail(email: User['email']) {
  return prisma.user.findUnique({
    where: { email },
  });
}
