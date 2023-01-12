/* eslint-disable @typescript-eslint/no-unused-vars */

import { Inject, Injectable } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';

import { IFollowRepository } from '@domain/repository/follow';
import ITransactionManager from '@domain/repository/transaction';
import { IUserRepository } from '@domain/repository/user';

import { Usecase, UsecaseInput, UsecaseOutput } from '@usecase/base';
import ApiResultDto from '@usecase/dto/api-result';
import {
  UsecaseError,
  UsecaseErrorCode,
  UsecaseErrorDetailCode,
} from '@usecase/exception';

export class UnfollowUserUsecaseInput extends UsecaseInput {
  @ApiProperty({
    description: 'Unfollow user id',
    type: Number,
  })
  destinationUserId: number;
}

export class UnfollowUserUsecaseOutput extends UsecaseOutput {
  @ApiProperty({
    description: 'ApiResultDto',
    type: ApiResultDto,
  })
  result: ApiResultDto;
}

@Injectable()
export default class UnfollowUserUsecase extends Usecase<
  UnfollowUserUsecaseInput,
  UnfollowUserUsecaseOutput
> {
  constructor(
    @Inject(IUserRepository) private readonly userRepository: IUserRepository,
    @Inject(IFollowRepository)
    private readonly followRepository: IFollowRepository,
    @Inject(ITransactionManager)
    private readonly transactionManager: ITransactionManager,
  ) {
    super();
  }

  async execute(
    input: UnfollowUserUsecaseInput,
    sourceUserId: number,
  ): Promise<UnfollowUserUsecaseOutput> {
    const [sourceUserEntity, destinationUserEntity] =
      await this.userRepository.getByIds(null, [
        sourceUserId,
        input.destinationUserId,
      ]);

    if (!sourceUserEntity) {
      throw new UsecaseError({
        code: UsecaseErrorCode.NOT_FOUND,
        message: 'Source user does not exist',
        info: {
          detailCode: UsecaseErrorDetailCode.SOURCE_USER_NOT_EXIST,
        },
      });
    }

    if (!destinationUserEntity) {
      throw new UsecaseError({
        code: UsecaseErrorCode.NOT_FOUND,
        message: 'Destination user does not exist',
        info: {
          detailCode: UsecaseErrorDetailCode.DESTINATION_USER_NOT_EXIST,
        },
      });
    }

    const followEntity = await this.followRepository.getByUserIds(
      null,
      sourceUserId,
      input.destinationUserId,
    );

    if (!followEntity) {
      throw new UsecaseError({
        code: UsecaseErrorCode.BAD_REQUEST,
        message: 'You are not following this user',
        info: {
          detailCode: UsecaseErrorDetailCode.NOT_FOLLOWING_USER,
        },
      });
    }

    try {
      await this.transactionManager.transaction(async (transaction) => {
        await this.followRepository.deleteById(transaction, followEntity.id);
      });
    } catch (err) {
      throw new UsecaseError({
        code: UsecaseErrorCode.INTERNAL_SERVER_ERROR,
        message: 'Internal server error',
      });
    }

    const output = new UnfollowUserUsecaseOutput();
    output.result = ApiResultDto.ok();

    return output;
  }
}
