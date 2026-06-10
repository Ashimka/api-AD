import type { Prisma } from '@prisma/client';

import { prisma } from '~/../lib/prisma.js';
import { throwNormalizedError } from '~/middleware/error-handler.js';

export async function createPostCars(
  data: Prisma.CarPostDataUncheckedCreateInput,
) {
  try {
    return await prisma.carPostData.create({ data });
  } catch (error) {
    throwNormalizedError(error);
  }
}

export async function getAllCarsPostByCarId(carId: string) {
  try {
    const cars = await prisma.carPostData.findMany({
      where: { userCarDataId: carId },
    });

    if (cars.length === 0) {
      throw new Error('Нет записей');
    }

    return cars;
  } catch (error) {
    throwNormalizedError(error);
  }
}

export async function updatePostCars(
  id: string,
  data: Prisma.CarPostDataUpdateInput,
) {
  return prisma.carPostData.update({
    where: { id },
    data,
  });
}
