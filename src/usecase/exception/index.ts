const UsecaseErrorCode = {
  BAD_REQUEST: 'BAD_REQUEST',
  NOT_FOUND: 'NOT_FOUND',
  INTERNAL_SERVER_ERROR: 'INTERNAL_SERVER_ERROR',
} as const;

export type UsecaseErrorCode =
  typeof UsecaseErrorCode[keyof typeof UsecaseErrorCode];

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
