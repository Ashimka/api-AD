import type { Request, Response } from 'express';
import { z } from 'zod';

import { validateBody } from '~/middleware/validate.js';
import { generateSixDigitCode } from '~/utils/index.js';

import {
  isActivatedUser,
  retrieveUserFromDatabaseByEmail,
  saveUserToDatabase,
} from '../user-profile/user-profile-model.js';
import { getIsPasswordValid, hashPassword } from './user-auth-helpers.js';
import {
  incrementAuthAttempts,
  resetAuthAttempts,
  saveAuthCodeToDatabase,
} from './user-auth-model.js';
// import { generateJwtToken } from './user-auth-helpers.js';

export async function signInOrCreateUser(request: Request, response: Response) {
  const body = await validateBody(
    z.object({
      email: z.email(),
    }),
    request,
    response,
  );

  const user = await saveUserToDatabase(body.email);

  const code = generateSixDigitCode();
  console.log({ code });
  const hashedCode = await hashPassword(code);

  await saveAuthCodeToDatabase(hashedCode, user.id);

  return response
    .status(201)
    .json({ message: 'Пользователь успешно авторизовался' });
}

export async function verifyEmailCode(request: Request, response: Response) {
  const body = await validateBody(
    z.object({
      email: z.email(),
      code: z.string().length(6),
    }),
    request,
    response,
  );

  // 1. Ищем пользователя
  const user = await retrieveUserFromDatabaseByEmail(body.email);

  if (!user || !user.codeActivate) {
    return response.status(404).json({ message: 'Пользователь не найден' });
  }

  const { code: hashedCode, expiresAt } = user.codeActivate;

  // 2. Проверяем срок действия кода
  if (expiresAt && Date.parse(expiresAt.toString()) < Date.now()) {
    return response
      .status(401)
      .json({ message: 'Время действия кода истекло' });
  }

  // 3. Проверяем валидность кода
  const isCodeValid = await getIsPasswordValid(body.code, hashedCode);

  if (isCodeValid) {
    await isActivatedUser(body.email);
    await resetAuthAttempts(user.id);

    return response.status(200).json({ message: 'Код успешно проверен' });
  }

  // 4. Код невалидный → увеличиваем количество попыток
  const count = await incrementAuthAttempts(user.id);

  if (count.attempts >= 3) {
    return response.status(429).json({
      message: 'Слишком много неудачных попыток. Пожалуйста, попробуйте позже.',
    });
  }

  return response.status(401).json({ message: 'Неверный код' });

  // // нахожу пользователя в базе по email
  // const user = await retrieveUserFromDatabaseByEmail(body.email);

  // // проверяю валидность кода
  // const isCodeValid = await getIsPasswordValid(
  //   body.code,
  //   user?.codeActivate?.code || '',
  // );

  // // проверяю не истекло ли время действия кода
  // const expiresAt = user?.codeActivate?.expiresAt;

  // if (expiresAt && Date.parse(expiresAt.toString()) < Date.now()) {
  //   console.log('время истекло');
  //   return response
  //     .status(401)
  //     .json({ message: 'Время действия кода истекло' });
  // }

  // if (isCodeValid) {
  //   console.log('валидный код');
  //   await isActivatedUser(body.email);
  //   await resetAuthAttempts(user?.id || '');
  // }

  // if (!isCodeValid) {
  //   const count = await incrementAuthAttempts(user?.id || '');

  //   if (count.attempts === 3) {
  //     return response.status(429).json({
  //       message:
  //         'Слишком много неудачных попыток. Пожалуйста, попробуйте позже.',
  //     });
  //   }
  //   return response.status(401).json({ message: 'Неверный код' });
  // }
  // return response.status(200).json({ message: 'Код успешно проверен' });
}
