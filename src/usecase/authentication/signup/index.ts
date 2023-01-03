/* eslint-disable @typescript-eslint/no-unused-vars */

import { IAuthenticateRepository } from '@domain/repository/authenticate';
import ITransactionManager from '@domain/repository/transaction';
import { IUserRepository } from '@domain/repository/user';
import { EmailVO } from '@domain/value-object/email-vo';
import { PasswordVO } from '@domain/value-object/password-vo';
import { UserFactory } from '@infrastructure/factory/user';
import { Inject, Injectable } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import ApiResultDto from '@usecase/dto/api-result';
import {
  UsecaseError,
  UsecaseErrorCode,
  UsecaseErrorDetailCode,
} from '@usecase/exception';
import { Usecase, UsecaseOutput } from '../../base';

export class SignupUsecaseInput {
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

class SignupUsecaseOutputData {
  @ApiProperty({
    description: 'JWT Token',
    required: true,
  })
  jwt: string;

  constructor(params: { jwt: string }) {
    this.jwt = params.jwt;
  }
}

export class SignupUsecaseOutput extends UsecaseOutput {
  @ApiProperty({
    description: 'Api Result',
    required: true,
    type: ApiResultDto,
  })
  result: ApiResultDto;

  @ApiProperty({
    description: 'Api Data',
    required: true,
    type: SignupUsecaseOutputData,
  })
  data: SignupUsecaseOutputData;
}

const userFactory = new UserFactory();

@Injectable()
export default class SignupUsecase extends Usecase<
  SignupUsecaseInput,
  SignupUsecaseOutput
> {
  constructor(
    @Inject(IUserRepository) private readonly userRepository: IUserRepository,
    @Inject(IAuthenticateRepository)
    private readonly authenRepository: IAuthenticateRepository,
    @Inject(ITransactionManager)
    private readonly transactionManager: ITransactionManager,
  ) {
    super();
  }

  async execute(input: SignupUsecaseInput): Promise<SignupUsecaseOutput> {
    const { email, password } = input;
    let jwt = '';

    if (!email || !password) {
      throw new UsecaseError({
        message: 'Must specify email and password',
        code: UsecaseErrorCode.BAD_REQUEST,
        info: {
          detailCode: UsecaseErrorDetailCode.MUST_SPECIFY_EMAIL_AND_PASSWORD,
        },
      });
    }

    const emailVO = new EmailVO(email);
    const passwordVO = new PasswordVO(password);
    const isEmailBeingUsed = await this.authenRepository.isEmailBeingUsed(
      email,
    );

    if (isEmailBeingUsed) {
      throw new UsecaseError({
        code: UsecaseErrorCode.BAD_REQUEST,
        message: 'Email is being used',
        info: {
          detailCode: UsecaseErrorDetailCode.EMAIL_IS_BEING_USED,
        },
      });
    }

    const userEntity = userFactory.createFromEmailAndPassword(
      emailVO,
      passwordVO,
    );

    try {
      await this.transactionManager.transaction(
        async (transaction: TransactionType): Promise<void> => {
          const createdUserEntity = await this.userRepository.save(
            transaction,
            userEntity,
          );
          jwt = this.authenRepository.getJWT(
            createdUserEntity.id,
            createdUserEntity.email.toString(),
          );
        },
      );
    } catch (error) {
      throw new UsecaseError({
        code: UsecaseErrorCode.INTERNAL_SERVER_ERROR,
        message: 'Internal Server Error',
      });
    }

    const output = new SignupUsecaseOutput();
    output.data = new SignupUsecaseOutputData({ jwt });
    output.result = ApiResultDto.ok();

    return output;
  }
}
