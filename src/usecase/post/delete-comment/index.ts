/* eslint-disable @typescript-eslint/no-unused-vars */

import { Inject, Injectable } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';

import { ICommentRepository } from '@domain/repository/comment';
import { IPostRepository } from '@domain/repository/post';
import ITransactionManager from '@domain/repository/transaction';
import { IUserRepository } from '@domain/repository/user';

import { Usecase, UsecaseInput, UsecaseOutput } from '@usecase/base';
import ApiResultDto from '@usecase/dto/api-result';
import {
  UsecaseError,
  UsecaseErrorCode,
  UsecaseErrorDetailCode,
} from '@usecase/exception';

export class DeletePostCommentUsecaseInput extends UsecaseInput {
  @ApiProperty({
    description: 'Post id',
    type: Number,
    required: true,
  })
  postId: number;

  @ApiProperty({
    description: 'Comment id',
    type: Number,
    required: true,
  })
  commentId: number;
}

export class DeletePostCommentUsecaseOutput extends UsecaseOutput {
  @ApiProperty({
    description: 'Api Result',
    type: ApiResultDto,
  })
  result: ApiResultDto;
}

@Injectable()
export default class DeletePostCommentUsecase extends Usecase<
  DeletePostCommentUsecaseInput,
  DeletePostCommentUsecaseOutput
> {
  constructor(
    @Inject(IUserRepository) private readonly userRepository: IUserRepository,
    @Inject(IPostRepository) private readonly postRepository: IPostRepository,
    @Inject(ICommentRepository)
    private readonly commentRepository: ICommentRepository,
    @Inject(ITransactionManager)
    private readonly transactionManager: ITransactionManager,
  ) {
    super();
  }

  async execute(
    input: DeletePostCommentUsecaseInput,
    userId: number,
  ): Promise<DeletePostCommentUsecaseOutput> {
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

    const commentEntity = await this.commentRepository.getById(
      null,
      input.commentId,
    );

    if (!commentEntity) {
      throw new UsecaseError({
        code: UsecaseErrorCode.NOT_FOUND,
        message: 'Comment does not exist',
        info: {
          detailCode: UsecaseErrorDetailCode.COMMENT_NOT_EXIST,
          commentId: input.commentId,
        },
      });
    }

    if (!postEntity.isCreatedBy(userId) && !commentEntity.isCreatedBy(userId)) {
      throw new UsecaseError({
        code: UsecaseErrorCode.BAD_REQUEST,
        message: 'Unauthorized to delete comment',
        info: {
          detailCode: UsecaseErrorDetailCode.UNAUTHORIZED_TO_DELETE_COMMENT,
        },
      });
    }

    if (!commentEntity.isCommentOfPost(input.postId)) {
      throw new UsecaseError({
        code: UsecaseErrorCode.BAD_REQUEST,
        message: 'Is not comment of post',
        info: {
          detailCode: UsecaseErrorDetailCode.IS_NOT_COMMENT_OF_POST,
        },
      });
    }

    try {
      await this.transactionManager.transaction(async (transaction) => {
        await this.commentRepository.deleteById(transaction, input.commentId);
      });
    } catch (err) {
      throw new UsecaseError({
        code: UsecaseErrorCode.INTERNAL_SERVER_ERROR,
        message: 'Internal Server Error',
      });
    }

    const output = new DeletePostCommentUsecaseOutput();
    output.result = ApiResultDto.ok();

    return output;
  }
}
