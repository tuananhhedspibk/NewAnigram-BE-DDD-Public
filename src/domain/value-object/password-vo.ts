import { ValueObject } from './base';
import { z } from 'zod';
import {
  DomainError,
  DomainErrorCode,
  DomainErrorDetailCode,
} from '@domain/exception';

const passwordCheckerRegex =
  /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
const passwordSchema = z.string().regex(passwordCheckerRegex);
type PasswordType = z.infer<typeof passwordSchema>;

export class PasswordVO extends ValueObject {
  value: string;

  constructor(input: PasswordType) {
    super();

    try {
      passwordSchema.parse(input);
      this.value = input;
    } catch (e) {
      throw new DomainError({
        code: DomainErrorCode.BAD_REQUEST,
        message:
          'Password must contain at least eight characters, at least one number and both lower and uppercase letters and special characters',
        info: {
          detailCode: DomainErrorDetailCode.INVALID_PASSWORD_FORMAT,
        },
      });
    }
  }

  toString() {
    return this.value;
  }
}
