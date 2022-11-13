export const PresentationErrorCode = {
  BAD_REQUEST: 'BAD_REQUEST',
  NOT_FOUND: 'NOT_FOUND',
  INTERNAL_SERVER_ERROR: 'INTERNAL_SERVER_ERROR',
} as const;
export type PresentationErrorCode =
  typeof PresentationErrorCode[keyof typeof PresentationErrorCode];

export const PresentationErrorDetailCode = {
  UNAUTHORIZED: 'UNAUTHORIZED',
  INVALID_FILE_TYPE: 'INVALID_FILE_TYPE',
} as const;
export type PresentationErrorDetailCode =
  typeof PresentationErrorDetailCode[keyof typeof PresentationErrorDetailCode];

interface PresentationErrorParams {
  info?: { [key: string]: unknown };
  code: PresentationErrorCode;
  message: string;
}

export class PresentationError extends Error {
  info?: { [key: string]: unknown };
  code: PresentationErrorCode;
  message: string;

  constructor(params: PresentationErrorParams) {
    super();

    this.code = params.code;
    this.message = params.message;
    this.info = params.info || null;
  }
}
