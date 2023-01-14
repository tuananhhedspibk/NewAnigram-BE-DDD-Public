/* eslint-disable @typescript-eslint/no-unused-vars */

import { ILikeRepository } from '@domain/repository/like';
import { IPostRepository } from '@domain/repository/post';
import ITransactionManager from '@domain/repository/transaction';
import { IUserRepository } from '@domain/repository/user';
import { Inject, Injectable } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';

import { Usecase, UsecaseInput, UsecaseOutput } from '@usecase/base';
import ApiResultDto from '@usecase/dto/api-result';
import {
  UsecaseError,
  UsecaseErrorCode,
  UsecaseErrorDetailCode,
} from '@usecase/exception';

export class UnlikePostUsecaseInput extends UsecaseInput {
  @ApiProperty({
    description: 'Post id',
    type: Number,
    required: true,
  })
  postId: number;
}

export class UnlikePostUsecaseOutput extends UsecaseOutput {
  @ApiProperty({
    description: 'Api result',
    type: ApiResultDto,
  })
  result: ApiResultDto;
}

@Injectable()
export default class UnlikePostUsecase extends Usecase<
  UnlikePostUsecaseInput,
  UnlikePostUsecaseOutput
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
    input: UnlikePostUsecaseInput,
    userId: number,
  ): Promise<UnlikePostUsecaseOutput> {
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

    const likeEntity = await this.likeRepository.getByPostAndUserId(
      null,
      input.postId,
      userId,
    );

    if (!likeEntity) {
      throw new UsecaseError({
        code: UsecaseErrorCode.BAD_REQUEST,
        message: 'You have not liked this post',
        info: {
          detailCode: UsecaseErrorDetailCode.HAVE_NOT_LIKED_POST,
        },
      });
    }

    try {
      await this.transactionManager.transaction(async (transaction) => {
        await this.likeRepository.deleteById(transaction, likeEntity.id);
      });
    } catch (err) {
      throw new UsecaseError({
        code: UsecaseErrorCode.INTERNAL_SERVER_ERROR,
        message: 'Internal Server Error',
      });
    }

    const output = new UnlikePostUsecaseOutput();
    output.result = ApiResultDto.ok();

    return output;
  }
}
