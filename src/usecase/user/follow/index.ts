/* eslint-disable @typescript-eslint/no-unused-vars */

import { Inject, Injectable } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';

import { IFollowRepository } from '@domain/repository/follow';
import ITransactionManager from '@domain/repository/transaction';
import { IUserRepository } from '@domain/repository/user';

import { FollowFactory } from '@infrastructure/factory/follow';

import { Usecase, UsecaseInput, UsecaseOutput } from '@usecase/base';
import ApiResultDto from '@usecase/dto/api-result';
import {
  UsecaseError,
  UsecaseErrorCode,
  UsecaseErrorDetailCode,
} from '@usecase/exception';

const followFactory = new FollowFactory();

export class FollowUserUsecaseInput extends UsecaseInput {
  @ApiProperty({
    description: 'Destination user id',
    required: true,
    type: Number,
  })
  destinationUserId: number;
}

export class FollowUserUsecaseOutput extends UsecaseOutput {
  @ApiProperty({
    description: 'API Result',
    type: ApiResultDto,
    required: true,
  })
  result: ApiResultDto;
}

@Injectable()
export default class FollowUserUsecase extends Usecase<
  FollowUserUsecaseInput,
  FollowUserUsecaseOutput
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
    input: FollowUserUsecaseInput,
    userId: number,
  ): Promise<FollowUserUsecaseOutput> {
    const [sourceUserEntity, destinationUserEntity] =
      await this.userRepository.getByIds(null, [
        userId,
        input.destinationUserId,
      ]);

    console.log(input.destinationUserId);
    console.log(userId);

    if (input.destinationUserId === userId) {
      throw new UsecaseError({
        code: UsecaseErrorCode.BAD_REQUEST,
        message: 'You can not follow yourself',
        info: {
          detailCode: UsecaseErrorDetailCode.CAN_NOT_FOLLOW_MYSELF,
        },
      });
    }

    if (!sourceUserEntity) {
      throw new UsecaseError({
        code: UsecaseErrorCode.NOT_FOUND,
        message: 'Source user does not exist',
        info: {
          detailCode: UsecaseErrorDetailCode.SOURCE_USER_NOT_EXIST,
          userId,
        },
      });
    }

    if (!destinationUserEntity) {
      throw new UsecaseError({
        code: UsecaseErrorCode.NOT_FOUND,
        message: 'Destination user does not exist',
        info: {
          detailCode: UsecaseErrorDetailCode.DESTINATION_USER_NOT_EXIST,
          userId: input.destinationUserId,
        },
      });
    }

    const followEntity = await this.followRepository.getByUserIds(
      null,
      userId,
      input.destinationUserId,
    );

    if (followEntity) {
      throw new UsecaseError({
        code: UsecaseErrorCode.BAD_REQUEST,
        message: 'You are following this user',
        info: {
          detailCode: UsecaseErrorDetailCode.HAVE_BEEN_FOLLOWING_USER,
        },
      });
    }

    const newFollowEntity = followFactory.reconstruct({
      sourceUserId: userId,
      destinationUserId: input.destinationUserId,
    });

    try {
      await this.transactionManager.transaction(async (transaction) => {
        await this.followRepository.save(transaction, newFollowEntity);
      });
    } catch (err) {
      throw new UsecaseError({
        code: UsecaseErrorCode.INTERNAL_SERVER_ERROR,
        message: 'Internal server error',
      });
    }

    const output = new FollowUserUsecaseOutput();
    output.result = ApiResultDto.ok();

    return output;
  }
}
