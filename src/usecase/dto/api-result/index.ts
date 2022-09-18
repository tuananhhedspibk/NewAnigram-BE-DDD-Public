/* eslint-disable @typescript-eslint/no-unused-vars */

import { ErrorCode, getErrorMessage } from '@constants/error';
import { WarnCode, getWarnMessage } from '@constants/warn';
import { Expose } from '@nestjs/class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import BaseDto from '../base';

export const ApiResultCode = {
  OK: 'OK',
  WARN: 'WARN',
  ERROR: 'ERROR',
} as const;

export type ApiResultCode = typeof ApiResultCode[keyof typeof ApiResultCode];

export class ApiError extends BaseDto {
  @ApiProperty({
    description: 'Error code',
    required: true,
    enum: ErrorCode,
    example: ErrorCode.SYSTEM_ERR,
  })
  @Expose()
  code: ErrorCode;

  @ApiProperty({
    description: 'Error message',
    required: true,
    type: String,
    example: 'Internal server error',
  })
  @Expose()
  message: string;

  constructor(code: ErrorCode) {
    super();

    this.code = code;
    this.message = getErrorMessage(code);
  }
}

export class ApiWarn extends BaseDto {
  @ApiProperty({
    description: 'Warning code',
    required: true,
    enum: WarnCode,
    example: WarnCode.SYSTEM_WARN,
  })
  @Expose()
  code: WarnCode;

  @ApiProperty({
    description: 'Warning message',
    required: true,
    type: String,
    example: 'FBI Warning',
  })
  @Expose()
  message: string;

  constructor(code: WarnCode) {
    super();

    this.code = code;
    this.message = getWarnMessage(code);
  }
}

export default class ApiResultDto extends BaseDto {
  @ApiProperty({
    description: 'Api result code',
    required: true,
    enum: ApiResultCode,
    example: ApiResultCode.OK,
    default: ApiResultCode.OK,
  })
  @Expose()
  code: ApiResultCode;

  @ApiProperty({
    description: 'Warning list',
    required: true,
    type: [ApiWarn],
    default: [],
  })
  @Expose()
  warnList: ApiWarn[];

  @ApiProperty({
    description: 'Error list',
    required: true,
    type: [ApiError],
    default: [],
  })
  @Expose()
  errorList: ApiError[];

  @ApiProperty({
    description: 'Api result message',
    required: false,
    type: String,
    example: 'Success',
  })
  @Expose()
  message?: string;

  constructor(params: {
    code: ApiResultCode;
    message?: string;
    warnList: ApiWarn[];
    errorList: ApiError[];
  }) {
    super();

    this.code = params.code;
    this.message = params.message || '';
    this.warnList = params.warnList || [];
    this.errorList = params.errorList || [];
  }

  // static constructor
  static ok() {
    return new ApiResultDto({
      code: ApiResultCode.OK,
      warnList: [],
      errorList: [],
    });
  }

  static warn(warnList: ApiWarn[]) {
    return new ApiResultDto({
      code: ApiResultCode.WARN,
      warnList,
      errorList: [],
    });
  }

  static error(errorList: ApiError[]) {
    return new ApiResultDto({
      code: ApiResultCode.ERROR,
      warnList: [],
      errorList,
    });
  }
}
