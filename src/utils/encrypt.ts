import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { z } from 'zod';

import { JWT_CONFIG, SALT_ROUND } from '@infrastructure/constants';

export type AuthenTokenParams = z.infer<typeof AuthenTokenParamsSchema>;
export const AuthenTokenParamsSchema = z.object({
  userId: z.number(),
  email: z.string(),
});

export const hashPassword = (barePassword: string, salt: string): string => {
  return bcrypt.hashSync(barePassword, salt);
};

export const randomlyGenerateSalt = (): string => {
  return bcrypt.genSaltSync(SALT_ROUND);
};

export const generateJWT = (userId: number, email: string): string => {
  return jwt.sign({ userId, email }, JWT_CONFIG.secrete, {
    expiresIn: JWT_CONFIG.expireTime,
  });
};

export const verifyJWT = (jwtToken: string): [boolean, FixType, Error] => {
  let decoded: jwt.JwtPayload | string;

  try {
    decoded = jwt.verify(jwtToken, JWT_CONFIG.secrete);

    return [true, decoded, null];
  } catch (error) {
    return [false, null, error];
  }
};
