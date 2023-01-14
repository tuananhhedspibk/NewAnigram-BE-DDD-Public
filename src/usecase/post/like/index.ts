/* eslint-disable @typescript-eslint/no-unused-vars */

import { Inject, Injectable } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';

import { IPostRepository } from '@domain/repository/post';
import ITransactionManager from '@domain/repository/transaction';
import { IUserRepository } from '@domain/repository/user';
import { ILikeRepository } from '@domain/repository/like';

import {
  UsecaseError,
  UsecaseErrorCode,
  UsecaseErrorDetailCode,
} from '@usecase/exception';
import { Usecase, UsecaseInput, UsecaseOutput } from '@usecase/base';
import ApiResultDto from '@usecase/dto/api-result';

import { LikeFactory } from '@infrastructure/factory/like';

const likeFactory = new LikeFactory();

export class LikePostUsecaseInput extends UsecaseInput {
  @ApiProperty({
    description: 'Post id',
    type: Number,
    required: true,
  })
  postId: number;
}

export class LikePostUsecaseOutput extends UsecaseOutput {
  @ApiProperty({
    description: 'Api Result',
    type: ApiResultDto,
  })
  result: ApiResultDto;
}

@Injectable()
export default class LikePostUsecase extends Usecase<
  LikePostUsecaseInput,
  LikePostUsecaseOutput
> {
  constructor(
    @Inject(IUserRepository) private readonly userRepository: IUserRepository,
    @Inject(IPostRepository) private readonly postRepository: IPostRepository,
    @Inject(ILikeRepository) private readonly likeRepository: ILikeRepository,
    @Inject(ITransactionManager)
    private readonly transactionManager: ITransactionManager,
  ) {
    super();
  }

  async execute(
    input: LikePostUsecaseInput,
    userId: number,
  ): Promise<LikePostUsecaseOutput> {
    const userEntity = await this.userRepository.getById(null, userId);

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

    const postEntity = await this.postRepository.getById(null, input.postId);

    if (!postEntity) {
      throw new UsecaseError({
        code: UsecaseErrorCode.NOT_FOUND,
        message: 'Post does not exist',
        info: {
          detailCode: UsecaseErrorDetailCode.POST_NOT_EXIST,
          postId: input.postId,
        },
      });
    }

    let likeEntity = await this.likeRepository.getByPostAndUserId(
      null,
      input.postId,
      userId,
    );

    if (likeEntity) {
      throw new UsecaseError({
        code: UsecaseErrorCode.BAD_REQUEST,
        message: 'You have liked this post',
        info: {
          detailCode: UsecaseErrorDetailCode.HAVE_BEEN_LIKED_POST,
        },
      });
    }

    likeEntity = likeFactory.reconstruct({
      postId: input.postId,
      userId,
    });

    try {
      await this.transactionManager.transaction(async (transaction) => {
        await this.likeRepository.save(transaction, likeEntity);
      });
    } catch (err) {
      throw new UsecaseError({
        code: UsecaseErrorCode.INTERNAL_SERVER_ERROR,
        message: 'Internal server error',
      });
    }

    const output = new LikePostUsecaseOutput();
    output.result = ApiResultDto.ok();

    return output;
  }
}
