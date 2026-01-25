import type { NextFunction, Request, Response } from 'express';
import {
  PrismaClientKnownRequestError,
  PrismaClientInitializationError,
  PrismaClientRustPanicError,
} from '@prisma/client-runtime-utils';

import { AppError, DatabaseError } from '~/errors/index.js';

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

  // Обработка ошибок Prisma - сначала проверяем конкретные типы
  if (error instanceof PrismaClientInitializationError) {
    console.error('Database connection error:', error);
    const dbError = new DatabaseError(
      'Не удалось подключиться к базе данных. Пожалуйста, попробуйте позже.',
    );
    response.status(dbError.statusCode).json({
      message: dbError.message,
      statusCode: dbError.statusCode,
    });
    return;
  }

  if (error instanceof PrismaClientRustPanicError) {
    console.error('Database panic error:', error);
    const dbError = new DatabaseError(
      'Критическая ошибка базы данных. Пожалуйста, попробуйте позже.',
    );
    response.status(dbError.statusCode).json({
      message: dbError.message,
      statusCode: dbError.statusCode,
    });
    return;
  }

  if (error instanceof PrismaClientKnownRequestError) {
    console.error('Prisma error:', error.code, error.message);

    // Обработка специфичных ошибок Prisma
    if (error.code === 'P2002') {
      // Unique constraint violation
      response.status(409).json({
        message: 'Запись с такими данными уже существует',
        statusCode: 409,
      });
      return;
    }

    if (error.code === 'P2025') {
      // Record not found
      response.status(404).json({
        message: 'Запись не найдена',
        statusCode: 404,
      });
      return;
    }

    // Общая ошибка базы данных
    const dbError = new DatabaseError('Ошибка при работе с базой данных');
    response.status(dbError.statusCode).json({
      message: dbError.message,
      statusCode: dbError.statusCode,
    });
    return;
  }

  // Проверка на другие ошибки подключения
  if (isDatabaseConnectionError(error)) {
    console.error('Database connection error:', error);
    const dbError = new DatabaseError(
      'Не удалось подключиться к базе данных. Пожалуйста, попробуйте позже.',
    );
    response.status(dbError.statusCode).json({
      message: dbError.message,
      statusCode: dbError.statusCode,
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
