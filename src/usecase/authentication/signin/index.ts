import { Usecase, UsecaseInput, UsecaseOutput } from '../../base';
import { ApiProperty } from '@nestjs/swagger';
import { Inject, Injectable } from '@nestjs/common';
import { IUserRepository } from '@domain/repositories/user';
import {
  UsecaseError,
  UsecaseErrorCode,
  UsecaseErrorDetailCode,
} from '@usecase/exception';
import { IAuthenticateRepository } from '@domain/repositories/authenticate';

export class SigninUsecaseInput {
  @ApiProperty({
    description: 'Email address',
    required: true,
  })
  email: string;

  @ApiProperty({
    description: 'Password',
    required: true,
  })
  password: string;
}

export class SigninUsecaseOutput {
  @ApiProperty({
    description: 'JWT Token',
    required: true,
  })
  jwt: string;
}

@Injectable()
export default class SigninUsecase extends Usecase<
  UsecaseInput,
  UsecaseOutput
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
        message: 'Email not exist',
        code: UsecaseErrorCode.BAD_REQUEST,
        info: {
          detailCode: UsecaseErrorDetailCode.EMAIL_NOT_EXISTS,
        },
      });
    }

    const result = await this.authenticateRepository.validate(email, password);

    if (!result) {
      throw new UsecaseError({
        message: 'Invalid email or password',
        code: UsecaseErrorCode.BAD_REQUEST,
        info: {
          detailCode: UsecaseErrorDetailCode.INVALID_EMAIL_OR_PASSWORD,
        },
      });
    }

    const jwt = await this.authenticateRepository.getJWT(
      user.id,
      user.userName,
    );

    const output = new SigninUsecaseOutput();
    output.jwt = jwt;

    return output;
  }
}
