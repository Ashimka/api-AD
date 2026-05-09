import type { Prisma } from '@prisma/client';

import { prisma } from '~/../lib/prisma.js';
import { throwNormalizedError } from '~/middleware/error-handler.js';

export async function createUserCarData(
  data: Prisma.UserCarDataUncheckedCreateInput,
) {
  try {
    return await prisma.userCarData.create({
      data,
    });
  } catch (error) {
    throwNormalizedError(error);
  }
}
