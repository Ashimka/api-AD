import type { Request, Response } from 'express';
import { z } from 'zod';

import { validateBody } from '~/middleware/validate.js';
import { generateSixDigitCode } from '~/utils/index.js';

import {
  retrieveUserFromDatabaseByEmail,
  saveUserToDatabase,
} from '../user-profile/user-profile-model.js';
import { hashPassword } from './user-auth-helpers.js';
import { saveAuthCodeToDatabase } from './user-auth-model.js';
// import { generateJwtToken } from './user-auth-helpers.js';

export async function register(request: Request, response: Response) {
  const body = await validateBody(
    z.object({
      email: z.email(),
    }),
    request,
    response,
  );

  const existingUser = await retrieveUserFromDatabaseByEmail(body.email);
  if (existingUser) {
    return response.status(400).json({ message: 'User already exists' });
  }
  const user = await saveUserToDatabase({
    email: body.email,
  });

  const code = generateSixDigitCode();
  const hashedCode = await hashPassword(code);

  await saveAuthCodeToDatabase(hashedCode, user.id);

  return response.status(201).json({ message: 'User registered successfully' });
}
