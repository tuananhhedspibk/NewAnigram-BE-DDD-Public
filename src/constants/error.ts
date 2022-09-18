export enum ErrorCode {
  SYSTEM_ERR = 'SYSTEM_ERR',
  INVALID_PASSWORD_ERR = 'INVALID_PASSWORD_ERR',
}

export const ERROR_MESSAGE: {
  [key: string]: string;
} = {
  [ErrorCode.SYSTEM_ERR]: 'Internal Server Error',
  [ErrorCode.INVALID_PASSWORD_ERR]: 'Invalid password',
};

export const getErrorMessage = (errorCode: ErrorCode): string => {
  return ERROR_MESSAGE[errorCode];
};
