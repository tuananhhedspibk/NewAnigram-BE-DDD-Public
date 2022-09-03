import * as bcrypt from 'bcrypt';

import { SALT_ROUND } from '@infrastructure/constants';

export const hashPassword = (barePassword: string, salt: string): string => {
  return bcrypt.hashSync(barePassword, salt);
};

export const randomlyGenerateSalt = (): string => {
  return bcrypt.genSaltSync(SALT_ROUND);
};
