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
  POST_MUST_HAVE_IMAGE: 'POST_MUST_HAVE_IMAGE',
  NUMBER_OF_PICS_LIMITED: 'NUMBER_OF_PICS_LIMITED',
  POST_NOT_EXIST: 'POST_NOT_EXIST',
  UNAUTHORIZED_TO_UPDATE_POST: 'UNAUTHORIZED_TO_UPDATE_POST',
  UNAUTHORIZED_TO_DELETE_POST: 'UNAUTHORIZED_TO_DELETE_POST',
  SOURCE_USER_NOT_EXIST: 'SOURCE_USER_NOT_EXIST',
  DESTINATION_USER_NOT_EXIST: 'DESTINATION_USER_NOT_EXIST',
  HAVE_BEEN_FOLLOWING_USER: 'HAVE_BEEN_FOLLOWING_USER',
  CAN_NOT_FOLLOW_MYSELF: 'CAN_NOT_FOLLOW_MYSELF',
  NOT_FOLLOWING_USER: 'NOT_FOLLOWING_USER',
  HAVE_BEEN_LIKED_POST: 'HAVE_BEEN_LIKED_POST',
  HAVE_NOT_LIKED_POST: 'HAVE_NOT_LIKED_POST',
  COMMENT_CONTENT_CAN_NOT_EMPTY: 'COMMENT_CONTENT_CAN_NOT_EMPTY',
  COMMENT_NOT_EXIST: 'COMMENT_NOT_EXIST',
  UNAUTHORIZED_TO_DELETE_COMMENT: 'UNAUTHORIZED_TO_DELETE_COMMENT',
  IS_NOT_COMMENT_OF_POST: 'IS_NOT_COMMENT_OF_POST',
  UNAUTHORIZED_TO_UPDATE_COMMENT: 'UNAUTHORIZED_TO_UPDATE_COMMENT',
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
