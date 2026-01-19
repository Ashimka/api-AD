/**
 * Кастомный класс ошибок приложения
 * Включает HTTP-статус код и опциональное сообщение для логирования
 */
export class AppError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;

  constructor(
    message: string,
    statusCode: number = 500,
    isOperational: boolean = true,
  ) {
    super(message);
    Object.setPrototypeOf(this, AppError.prototype);

    this.statusCode = statusCode;
    this.isOperational = isOperational;
  }
}

/**
 * Ошибка аутентификации (401 Unauthorized)
 */
export class AuthenticationError extends AppError {
  constructor(message: string = 'Authentication failed') {
    super(message, 401, true);
    Object.setPrototypeOf(this, AuthenticationError.prototype);
  }
}

/**
 * Ошибка авторизации (403 Forbidden)
 */
export class AuthorizationError extends AppError {
  constructor(message: string = 'Access denied') {
    super(message, 403, true);
    Object.setPrototypeOf(this, AuthorizationError.prototype);
  }
}

/**
 * Ошибка валидации (400 Bad Request)
 */
export class ValidationError extends AppError {
  constructor(message: string = 'Validation failed') {
    super(message, 400, true);
    Object.setPrototypeOf(this, ValidationError.prototype);
  }
}
