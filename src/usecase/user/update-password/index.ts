/* eslint-disable @typescript-eslint/no-unused-vars */

import { Inject, Injectable } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';

import { IAuthenticateRepository } from '@domain/repository/authenticate';
import ITransactionManager from '@domain/repository/transaction';
import { IUserRepository } from '@domain/repository/user';

import { Usecase, UsecaseInput, UsecaseOutput } from '@usecase/base';
import ApiResultDto from '@usecase/dto/api-result';
import {
  UsecaseError,
  UsecaseErrorCode,
  UsecaseErrorDetailCode,
} from '@usecase/exception';

export class UpdatePasswordUsecaseInput extends UsecaseInput {
  @ApiProperty({
    description: 'Current password (encrypted)',
    required: true,
    type: String,
  })
  currentPassword: string;

  @ApiProperty({
    description: 'New password (encrypted)',
    required: true,
    type: String,
  })
  newPassword: string;
}

export class UpdatePasswordUsecaseOutput extends UsecaseOutput {
  @ApiProperty({
    description: 'API result',
    type: ApiResultDto,
    required: true,
  })
  result: ApiResultDto;
}

@Injectable()
export default class UpdatePasswordUsecase extends Usecase<
  UpdatePasswordUsecaseInput,
  UpdatePasswordUsecaseOutput
> {
  constructor(
    @Inject(IAuthenticateRepository)
    private readonly authenRepository: IAuthenticateRepository,
    @Inject(IUserRepository)
    private readonly userRepository: IUserRepository,
    @Inject(ITransactionManager)
    private readonly transactionManager: ITransactionManager,
  ) {
    super();
  }

  async execute(
    input: UpdatePasswordUsecaseInput,
    userId: number,
  ): Promise<UpdatePasswordUsecaseOutput> {
    const userEntity = await this.userRepository.getById(null, userId);
    let result;

    if (!userEntity) {
      throw new UsecaseError({
        code: UsecaseErrorCode.NOT_FOUND,
        message: 'User does not exist',
        info: {
          detailCode: UsecaseErrorDetailCode.USER_NOT_EXIST,
          userId,
        },
      });
    }

    try {
      result = await this.authenRepository.validatePassword(
        userEntity.email.toString(),
        input.currentPassword,
      );
    } catch (error) {
      throw new UsecaseError({
        code: UsecaseErrorCode.INTERNAL_SERVER_ERROR,
        message: 'Internal server error',
      });
    }

    if (!result) {
      throw new UsecaseError({
        code: UsecaseErrorCode.BAD_REQUEST,
        message: 'Current password does not match',
        info: {
          detailCode: UsecaseErrorDetailCode.CURRENT_PASS_NOT_MATCH,
        },
      });
    }

    userEntity.updatePassword(input.newPassword);

    try {
      await this.transactionManager.transaction(
        async (transaction: TransactionType): Promise<void> => {
          await this.userRepository.update(transaction, userEntity);
        },
      );
    } catch (error) {
      throw new UsecaseError({
        code: UsecaseErrorCode.INTERNAL_SERVER_ERROR,
        message: 'Internal Server Error',
      });
    }

    const output = new UpdatePasswordUsecaseOutput();
    output.result = ApiResultDto.ok();

    return output;
  }
}
