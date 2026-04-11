import type { Prisma } from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/client';
import { prisma } from '~/../lib/prisma.js';

export async function createUserCarData(
  data: Prisma.UserCarDataUncheckedCreateInput,
) {
  try {
    return await prisma.userCarData.create({
      data,
    });
  } catch (error) {
    if (
      error instanceof PrismaClientKnownRequestError &&
      error.code === 'ECONNREFUSED'
    ) {
      console.log('Ошибка подключения к базе данных');
    }
    console.log('error', error);
  }
}
