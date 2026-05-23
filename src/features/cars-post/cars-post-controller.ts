import type { Request, Response } from 'express';
import z from 'zod';

import { validateBody } from '~/middleware/validate.js';

import { createPostCars } from './cars-post-model.js';

export async function createPostCar(request: Request, response: Response) {
  const body = await validateBody(
    z.object({
      type: z
        .string({ message: 'Тип записи обязательно' })
        .min(1, 'Тип записи не может быть пустым')
        .max(100, 'Запись слишком длинная'),

      description: z
        .string()
        .min(4, 'Описание не может быть пустым')
        .max(1000, 'Описание слишком длинное')
        .optional()
        .nullable(),

      cost: z
        .number()
        .min(0, 'Цена не может быть отрицательным')
        .optional()
        .nullable(),

      userCarDataId: z.string(),
    }),
    request,
    response,
  );

  const post = await createPostCars(body);

  return response.status(201).json({ message: 'Запись создана', post });
}
