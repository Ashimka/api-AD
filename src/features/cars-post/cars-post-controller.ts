import type { Request, Response } from 'express';
import z from 'zod';

import {
  validateBody,
  validateParams,
  validateQuery,
} from '~/middleware/validate.js';

import {
  createPostCars,
  getAllPostByCarId,
  updatePostCars,
} from './cars-post-model.js';
import {
  createPostCarSchema,
  idCarsParamsSchema,
  idParamsSchema,
  updatePostCarSchema,
} from './cars-post-schema.js';

export async function createPostCar(request: Request, response: Response) {
  const body = await validateBody(createPostCarSchema, request, response);

  const post = await createPostCars(body);

  return response.status(201).json({ message: 'Запись создана', post });
}

export async function updatePostCar(request: Request, response: Response) {
  const { id } = await validateParams(idParamsSchema, request, response);

  const body = await validateBody(updatePostCarSchema, request, response);

  const post = await updatePostCars(id, body);

  return response.status(200).json({
    message: 'Запись обновлена',
    post,
  });
}

export async function getAllPostCar(request: Request, response: Response) {
  const query = await validateQuery(
    z.object({
      page: z.coerce.number().int().positive().default(1),
      limit: z.coerce.number().int().positive().max(100).default(10),
    }),
    request,
    response,
  );
  const { carId } = await validateParams(idCarsParamsSchema, request, response);

  const posts = await getAllPostByCarId(carId, query.page, query.limit);

  return response.status(200).json(posts);
}
