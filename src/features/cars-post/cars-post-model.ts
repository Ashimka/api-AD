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

export async function getAllPostByCarId(carId: string, page = 1, limit = 10) {
  try {
    const skip = (page - 1) * limit;
    const [cars, total] = await Promise.all([
      prisma.carPostData.findMany({
        where: {
          userCarDataId: carId,
        },
        skip,
        take: limit,
        orderBy: {
          createdAt: 'desc',
        },
      }),

      prisma.carPostData.count({
        where: {
          userCarDataId: carId,
        },
      }),
    ]);
    return {
      data: cars,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  } catch (error) {
    throwNormalizedError(error);
  }
}

export async function updatePostCars(
  id: string,
  data: Prisma.CarPostDataUpdateInput,
) {
  try {
    return prisma.carPostData.update({
      where: { id },
      data,
    });
  } catch (error) {
    throwNormalizedError(error);
  }
}

export async function deletePostCarById(id: string) {
  try {
    return prisma.carPostData.delete({
      where: { id },
    });
  } catch (error) {
    throwNormalizedError(error);
  }
}
