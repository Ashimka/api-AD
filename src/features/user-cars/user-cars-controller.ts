import type { Request, Response } from 'express';
import { z } from 'zod';
import { getJwtTokenFromHeaders } from '~/features/user-auth/user-auth-helpers.js';
import { validateBody } from '~/middleware/validate.js';
import { createUserCarData } from './user-cars-model.js';

export async function createCar(request: Request, response: Response) {
  const body = await validateBody(
    z.object({
      car: z
        .string({ message: 'Название автомобиля обязательно' })
        .min(1, 'Название автомобиля не может быть пустым')
        .max(100, 'Название слишком длинное'),

      year: z
        .string()
        .regex(/^\d{4}$/, 'Год должен состоять из 4 цифр')
        .optional()
        .nullable(),

      mileage: z
        .number()
        .int('Пробег должен быть целым числом')
        .min(0, 'Пробег не может быть отрицательным')
        .optional()
        .nullable(),

      color: z
        .string()
        .max(30, 'Название цвета слишком длинное')
        .optional()
        .nullable(),

      fuelType: z
        .string()
        .max(20, 'Тип топлива слишком длинный')
        .optional()
        .nullable(),

      transmission: z
        .string()
        .max(30, 'Тип трансмиссии слишком длинный')
        .optional()
        .nullable(),
    }),
    request,
    response,
  );

  const tokenPayload = getJwtTokenFromHeaders(request);
  const userId =
    typeof tokenPayload.id === 'string' ? tokenPayload.id : undefined;
  if (!userId) {
    return response.status(401).json({ message: 'Неверный токен' });
  }

  const car = await createUserCarData({ ...body, userId });
  return response.status(201).json({ message: 'Автомобиль создан', car });
}
