export const DomainErrorCode = {
  BAD_REQUEST: 'BAD_REQUEST',
  NOT_FOUND: 'NOT_FOUND',
  INTERNAL_SERVER_ERROR: 'INTERNAL_SERVER_ERROR',
} as const;
export type DomainErrorCode =
  typeof DomainErrorCode[keyof typeof DomainErrorCode];

export const DomainErrorDetailCode = {
  INVALID_EMAIL_FORMAT: 'INVALID_EMAIL_FORMAT',
} as const;

export type DomainErrorDetailCode =
  typeof DomainErrorDetailCode[keyof typeof DomainErrorDetailCode];

interface DomainErrorParams {
  info?: { [key: string]: unknown };
  code: DomainErrorCode;
  message: string;
}

export class DomainError extends Error {
  info?: { [key: string]: unknown };
  code: DomainErrorCode;
  message: string;

  constructor(params: DomainErrorParams) {
    super();

    this.code = params.code;
    this.message = params.message;
    this.info = params.info || null;
  }
}
