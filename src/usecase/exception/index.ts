export const UsecaseErrorCode = {
  BAD_REQUEST: 'BAD_REQUEST',
  NOT_FOUND: 'NOT_FOUND',
  INTERNAL_SERVER_ERROR: 'INTERNAL_SERVER_ERROR',
} as const;

export type UsecaseErrorCode =
  typeof UsecaseErrorCode[keyof typeof UsecaseErrorCode];

export const UsecaseErrorDetailCode = {
  MUST_SPECIFY_EMAIL_AND_PASSWORD: 'MUST_SPECIFY_EMAIL_AND_PASSWORD',
  EMAIL_DOES_NOT_EXISTS: 'EMAIL_DOES_NOT_EXISTS',
  INVALID_EMAIL_OR_PASSWORD: 'INVALID_EMAIL_OR_PASSWORD',
  EMAIL_IS_BEING_USED: 'EMAIL_IS_BEING_USED',
  USER_NOT_EXIST: 'USER_NOT_EXIST',
  CURRENT_PASS_NOT_MATCH: 'CURRENT_PASS_NOT_MATCH',
} as const;

export type UsecaseErrorDetailCode =
  typeof UsecaseErrorDetailCode[keyof typeof UsecaseErrorDetailCode];

interface UsecaseErrorParams {
  info?: { [key: string]: unknown };
  message: string;
  code: UsecaseErrorCode;
}

export class UsecaseError extends Error {
  info?: { [key: string]: unknown };
  message: string;
  code: UsecaseErrorCode;

  constructor(params: UsecaseErrorParams) {
    super();

    this.message = params.message;
    this.code = params.code;
    this.info = params.info || null;
  }
}
