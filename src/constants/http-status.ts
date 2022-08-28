import { HttpStatus } from '@nestjs/common';

export const HTTP_STATUS = {
  OK: HttpStatus.OK, // 200
  NOT_FOUND: HttpStatus.NOT_FOUND, // 404
  INTERNAL_SERVER_ERROR: HttpStatus.INTERNAL_SERVER_ERROR, // 500
  GATEWAY_TIMEOUT: HttpStatus.GATEWAY_TIMEOUT, // 504
} as const;
