import type { Request, Response } from 'express';
import type { ZodType } from 'zod';
import { ZodError } from 'zod';

import { ValidationError } from '~/errors/index.js';

export function createValidate(key: 'body' | 'query' | 'params') {
  return async function validate<T>(
    schema: ZodType<T>,
    request: Request,
    _response: Response,
  ): Promise<T> {
    try {
      const result = await schema.parseAsync(request[key]);
      return result;
    } catch (error) {
      if (error instanceof ZodError) {
        throw new ValidationError(
          `Validation failed: ${error.issues.map(issue => issue.message).join(', ')}`,
        );
      }
      throw error;
    }
  };
}

export const validateBody = createValidate('body');
export const validateQuery = createValidate('query');
export const validateParams = createValidate('params');
