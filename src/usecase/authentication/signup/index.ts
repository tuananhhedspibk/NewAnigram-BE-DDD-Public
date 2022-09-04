import { IAuthenticateRepository } from '@domain/repositories/authenticate';
import ITransactionManager from '@domain/repositories/transaction';
import { IUserRepository } from '@domain/repositories/user';
import { EmailVO } from '@domain/value-objects/email-vo';
import { UserFactory } from '@infrastructure/factories/user';
import { Inject, Injectable } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
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

export class SignupUsecaseOutput extends UsecaseOutput {
  @ApiProperty({
    description: 'JWT Token',
    required: true,
  })
  jwt: string;
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
      password,
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
    output.jwt = jwt;

    return output;
  }
}
