import type { Request, Response } from 'express';

import { validateBody, validateParams } from '~/middleware/validate.js';

import { createPostCars, updatePostCars } from './cars-post-model.js';
import {
  createPostCarSchema,
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
