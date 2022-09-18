export const ErrorCode = {
  SYSTEM_ERR: 'SYSTEM_ERR',
} as const;

export type ErrorCode = typeof ErrorCode[keyof typeof ErrorCode];

export const ERROR_MESSAGE: {
  [key: string]: string;
} = {
  [ErrorCode.SYSTEM_ERR]: 'Internal Server Error',
};

export const getErrorMessage = (errorCode: ErrorCode): string => {
  return ERROR_MESSAGE[errorCode];
};
