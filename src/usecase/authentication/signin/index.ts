/* eslint-disable @typescript-eslint/no-unused-vars */

import { Usecase, UsecaseInput, UsecaseOutput } from '../../base';
import { ApiProperty } from '@nestjs/swagger';
import { Inject, Injectable } from '@nestjs/common';
import { IUserRepository } from '@domain/repository/user';
import {
  UsecaseError,
  UsecaseErrorCode,
  UsecaseErrorDetailCode,
} from '@usecase/exception';
import { IAuthenticateRepository } from '@domain/repository/authenticate';
import ApiResultDto from '@usecase/dto/api-result';

export class SigninUsecaseInput {
  @ApiProperty({
    description: 'Email address',
    required: true,
  })
  email: string;

  @ApiProperty({
    description: 'Password',
    required: true,
    format: 'password',
  })
  password: string;
}

class SigninUsecaseOutputData {
  @ApiProperty({
    description: 'JWT Token',
    type: String,
    required: true,
  })
  jwt: string;

  constructor(params: { jwt: string }) {
    this.jwt = params.jwt;
  }
}

export class SigninUsecaseOutput {
  @ApiProperty({
    description: 'Api result',
    type: ApiResultDto,
    required: true,
  })
  result: ApiResultDto;

  @ApiProperty({
    description: 'Api data',
    type: SigninUsecaseOutputData,
    required: true,
  })
  data: SigninUsecaseOutputData;
}

@Injectable()
export default class SigninUsecase extends Usecase<
  SigninUsecaseInput,
  SigninUsecaseOutput
> {
  constructor(
    @Inject(IUserRepository) private readonly userRepository: IUserRepository,
    @Inject(IAuthenticateRepository)
    private readonly authenticateRepository: IAuthenticateRepository,
  ) {
    super();
  }

  async execute(input: SigninUsecaseInput): Promise<SigninUsecaseOutput> {
    const { email, password } = input;

    if (!email || !password) {
      throw new UsecaseError({
        message: 'Must specify email and password',
        code: UsecaseErrorCode.BAD_REQUEST,
        info: {
          detailCode: UsecaseErrorDetailCode.MUST_SPECIFY_EMAIL_AND_PASSWORD,
        },
      });
    }

    const user = await this.userRepository.getByEmail(null, email);

    if (!user) {
      throw new UsecaseError({
        message: 'Email does not exist',
        code: UsecaseErrorCode.BAD_REQUEST,
        info: {
          detailCode: UsecaseErrorDetailCode.EMAIL_DOES_NOT_EXISTS,
        },
      });
    }

    const result = await this.authenticateRepository.validatePassword(
      email,
      password,
    );

    if (!result) {
      throw new UsecaseError({
        message: 'Invalid email or password',
        code: UsecaseErrorCode.BAD_REQUEST,
        info: {
          detailCode: UsecaseErrorDetailCode.INVALID_EMAIL_OR_PASSWORD,
        },
      });
    }

    const jwt = this.authenticateRepository.getJWT(
      user.id,
      user.email.toString(),
    );

    const output = new SigninUsecaseOutput();
    output.result = ApiResultDto.ok();
    output.data = new SigninUsecaseOutputData({ jwt });

    return output;
  }
}
