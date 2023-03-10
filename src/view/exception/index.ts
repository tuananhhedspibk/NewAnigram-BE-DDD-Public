export const ViewErrorCode = {
  BAD_REQUEST: 'BAD_REQUEST',
  NOT_FOUND: 'NOT_FOUND',
  INTERNAL_SERVER_ERROR: 'INTERNAL_SERVER_ERROR',
} as const;

export type ViewErrorCode = typeof ViewErrorCode[keyof typeof ViewErrorCode];

export const ViewErrorDetailCode = {
  USER_NOT_EXIST: 'USER_NOT_EXIST',
} as const;
export type ViewErrorDetailCode =
  typeof ViewErrorDetailCode[keyof typeof ViewErrorDetailCode];

interface ViewErrorParams {
  info?: { [key: string]: string };
  message: string;
  code: ViewErrorCode;
}

export class ViewError extends Error {
  info?: { [key: string]: string };
  message: string;
  code: ViewErrorCode;

  constructor(params: ViewErrorParams) {
    super();

    this.code = params.code;
    this.message = params.message;
    this.info = params.info || null;
  }
}
