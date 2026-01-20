import type { NextFunction, Request, Response } from 'express';

import { AppError } from '~/errors/index.js';

/**
 * Глобальный обработчик ошибок для Express
 * Обрабатывает кастомные ошибки (AppError и его подклассы)
 * и отправляет правильные HTTP-ответы с соответствующими статус-кодами
 */
export function errorHandler(
  error: unknown,
  _request: Request,
  response: Response,
  _next: NextFunction,
): void {
  if (error instanceof AppError) {
    response.status(error.statusCode).json({
      message: error.message,
      statusCode: error.statusCode,
    });
    return;
  }

  // Для неожиданных ошибок
  if (error instanceof Error) {
    console.error('Unexpected error:', error.message);
    response.status(500).json({
      message: 'Internal Server Error',
      statusCode: 500,
    });
    return;
  }

  // Для неизвестных типов ошибок
  console.error('Unknown error:', error);
  response.status(500).json({
    message: 'Internal Server Error',
    statusCode: 500,
  });
}
