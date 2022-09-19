/* eslint-disable @typescript-eslint/no-unused-vars */

import { Inject } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';

import { ErrorCode } from '@constants/error';
import { IAuthenticateRepository } from '@domain/repository/authenticate';
import { Usecase, UsecaseInput, UsecaseOutput } from '@usecase/base';
import ApiResultDto, { ApiError } from '@usecase/dto/api-result';
import { UsecaseError, UsecaseErrorCode } from '@usecase/exception';

export class CheckPasswordUsecaseInput extends UsecaseInput {
  @ApiProperty({
    description: 'Current password (descrypted)',
    type: String,
    required: true,
  })
  password: string;
}

class CheckPasswordUsecaseOutputData {
  @ApiProperty({
    description: 'Password valid check',
    type: Boolean,
    required: true,
    example: true,
  })
  valid: boolean;

  constructor(params: { valid: boolean }) {
    this.valid = params.valid || false;
  }
}

export class CheckPasswordUsecaseOutput extends UsecaseOutput {
  @ApiProperty({
    description: 'Api result',
    type: ApiResultDto,
    required: true,
  })
  result: ApiResultDto;

  @ApiProperty({
    description: 'Api data',
    type: CheckPasswordUsecaseOutputData,
    required: true,
  })
  data: CheckPasswordUsecaseOutputData;
}

@Injectable()
export default class CheckPasswordUsecase extends Usecase<
  CheckPasswordUsecaseInput,
  CheckPasswordUsecaseOutput
> {
  constructor(
    @Inject(IAuthenticateRepository)
    private readonly authenRepository: IAuthenticateRepository,
  ) {
    super();
  }

  async execute(
    input: CheckPasswordUsecaseInput,
    email: string,
  ): Promise<CheckPasswordUsecaseOutput> {
    const output = new CheckPasswordUsecaseOutput();
    let result = false;

    try {
      result = await this.authenRepository.validate(email, input.password);
    } catch (error) {
      throw new UsecaseError({
        code: UsecaseErrorCode.INTERNAL_SERVER_ERROR,
        message: 'Internal server error',
      });
    }

    output.data = new CheckPasswordUsecaseOutputData({ valid: result });

    if (result) {
      output.result = ApiResultDto.ok();
    } else {
      const apiError = new ApiError(ErrorCode.INVALID_PASSWORD_ERR);
      output.result = ApiResultDto.error([apiError]);
    }

    return output;
  }
}
