const InfrastructureErrorCode = {
  BAD_REQUEST: 'BAD_REQUEST',
  NOT_FOUND: 'NOT_FOUND',
  INTERNAL_SERVER_ERROR: 'INTERNAL_SERVER_ERROR',
} as const;
export type InfrastructureCode =
  typeof InfrastructureErrorCode[keyof typeof InfrastructureErrorCode];

interface InfraStructureErrorParams {
  info?: { [key: string]: unknown };
  code: InfrastructureCode;
  message: string;
}

export class InfrastructureError extends Error {
  info?: { [key: string]: unknown };
  code: InfrastructureCode;
  message: string;

  constructor(params: InfraStructureErrorParams) {
    super();

    this.code = params.code;
    this.message = params.message;
    this.info = params.info || null;
  }
}
