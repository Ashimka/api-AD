import {
  PrismaClientInitializationError,
  PrismaClientKnownRequestError,
  PrismaClientRustPanicError,
} from '@prisma/client-runtime-utils';
import type { NextFunction, Request, Response } from 'express';

import {
  AppError,
  ConflictError,
  DatabaseError,
  NotFoundError,
} from '~/errors/index.js';

function sendHttpError(
  response: Response,
  statusCode: 401 | 403 | 404 | 409,
  message: string,
) {
  response.status(statusCode).json({
    message,
    statusCode,
  });
}

/**
 * Проверяет, является ли ошибка ошибкой подключения к базе данных
 */
function isDatabaseConnectionError(error: unknown): error is Error {
  if (error instanceof PrismaClientInitializationError) {
    return true;
  }

  if (error instanceof PrismaClientRustPanicError) {
    return true;
  }

  if (error instanceof Error) {
    // Проверка на ошибки подключения PostgreSQL
    const connectionErrorMessages = [
      'connection',
      'connect',
      'timeout',
      'ECONNREFUSED',
      'ENOTFOUND',
      'ETIMEDOUT',
      'P1001', // Prisma error code for connection timeout
      'P1017', // Prisma error code for server closed connection
    ];

    const errorMessage = error.message.toLowerCase();
    return connectionErrorMessages.some(msg => errorMessage.includes(msg));
  }

  return false;
}

/**
 * Приводит любую ошибку к AppError так же, как это делает HTTP errorHandler.
 * Используйте в слое модели: `catch (e) { throwNormalizedError(e); }`
 */
export function classifyError(error: unknown): AppError {
  if (error instanceof AppError) {
    return error;
  }

  if (error instanceof PrismaClientInitializationError) {
    console.error('Database connection error:', error);
    return new DatabaseError(
      'Не удалось подключиться к базе данных. Пожалуйста, попробуйте позже.',
    );
  }

  if (error instanceof PrismaClientRustPanicError) {
    console.error('Database panic error:', error);
    return new DatabaseError(
      'Критическая ошибка базы данных. Пожалуйста, попробуйте позже.',
    );
  }

  if (error instanceof PrismaClientKnownRequestError) {
    console.error('Prisma error:', error.code, error.message);

    if (error.code === 'P2002') {
      return new ConflictError('Запись с такими данными уже существует');
    }

    if (error.code === 'P2025') {
      return new NotFoundError('Запись не найдена');
    }

    return new DatabaseError('Ошибка при работе с базой данных');
  }

  if (isDatabaseConnectionError(error)) {
    console.error('Database connection error:', error);
    return new DatabaseError(
      'Не удалось подключиться к базе данных. Пожалуйста, попробуйте позже.',
    );
  }

  if (error instanceof Error) {
    console.error('Unexpected error:', error.message);
    return new AppError('Internal Server Error', 500);
  }

  console.error('Unknown error:', error);
  return new AppError('Internal Server Error', 500);
}

export function throwNormalizedError(error: unknown): never {
  throw classifyError(error);
}

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
  const err = classifyError(error);

  if (err.statusCode === 401) {
    sendHttpError(response, 401, err.message);
    return;
  }

  if (err.statusCode === 403) {
    sendHttpError(response, 403, err.message);
    return;
  }

  if (err.statusCode === 404) {
    sendHttpError(response, 404, err.message);
    return;
  }

  if (err.statusCode === 409) {
    sendHttpError(response, 409, err.message);
    return;
  }

  response.status(err.statusCode).json({
    message: err.message,
    statusCode: err.statusCode,
  });
}
