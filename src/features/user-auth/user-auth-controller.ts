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

  return response.status(201).json({ message: 'User registered successfully' });
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

  const user = await retrieveUserFromDatabaseByEmail(body.email);

  const isCodeValid = await getIsPasswordValid(
    body.code,
    user?.codeActivate?.code || '',
  );

  if (isCodeValid) {
    isActivatedUser(body.email);
    resetAuthAttempts(user?.id || '');
  }

  if (!isCodeValid) {
    const count = await incrementAuthAttempts(user?.id || '');

    if (count.attempts === 3) {
      return response
        .status(429)
        .json({ message: 'Too many failed attempts. Please try again later.' });
    }
    return response.status(401).json({ message: 'Invalid code' });
  }
  return response.status(200).json({ message: 'Code verified successfully' });
}
