import type { NextFunction, Request, Response } from 'express';

import { checkDatabaseConnection } from '~/../lib/prisma.js';

export async function authDbMiddleware(
  request: Request,
  response: Response,
  next: NextFunction,
): Promise<void> {
  try {
    await checkDatabaseConnection();
    next();
  } catch (error) {
    response.status(503).json({
      message: 'Сервер не может подключиться к базе данных',
      error: error instanceof Error ? error.message : 'Unknown error',
      statusCode: 503,
    });
  }
}
