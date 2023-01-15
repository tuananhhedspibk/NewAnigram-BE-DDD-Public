/* eslint-disable @typescript-eslint/no-unused-vars */

import { ICommentRepository } from '@domain/repository/comment';
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

export class UpdatePostCommentUsecaseInput extends UsecaseInput {
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

  @ApiProperty({
    description: 'New content',
    type: String,
    required: true,
  })
  content: string;
}

export class UpdatePostCommentUsecaseOutput extends UsecaseOutput {
  @ApiProperty({
    description: 'Api Result',
    type: ApiResultDto,
  })
  result: ApiResultDto;
}

@Injectable()
export default class UpdatePostCommentUsecase extends Usecase<
  UpdatePostCommentUsecaseInput,
  UpdatePostCommentUsecaseOutput
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
    input: UpdatePostCommentUsecaseInput,
    userId: number,
  ): Promise<UpdatePostCommentUsecaseOutput> {
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

    if (!commentEntity.isCreatedBy(userId)) {
      throw new UsecaseError({
        code: UsecaseErrorCode.BAD_REQUEST,
        message: 'Unauthorized to update comment',
        info: {
          detailCode: UsecaseErrorDetailCode.UNAUTHORIZED_TO_UPDATE_COMMENT,
        },
      });
    }

    if (!input.content.length) {
      throw new UsecaseError({
        code: UsecaseErrorCode.BAD_REQUEST,
        message: 'Comment content can not be empty',
        info: {
          detailCode: UsecaseErrorDetailCode.COMMENT_CONTENT_CAN_NOT_EMPTY,
        },
      });
    }

    commentEntity.updateContent(input.content);

    try {
      await this.transactionManager.transaction(async (transaction) => {
        await this.commentRepository.update(transaction, commentEntity);
      });
    } catch (err) {
      throw new UsecaseError({
        code: UsecaseErrorCode.INTERNAL_SERVER_ERROR,
        message: 'Internal Server Error',
      });
    }

    const output = new UpdatePostCommentUsecaseOutput();
    output.result = ApiResultDto.ok();

    return output;
  }
}
