/* eslint-disable @typescript-eslint/no-unused-vars */

import { Inject, Injectable } from '@nestjs/common';

import { IPostRepository } from '@domain/repository/post';
import ITransactionManager from '@domain/repository/transaction';
import { IUserRepository } from '@domain/repository/user';

import { Usecase, UsecaseInput, UsecaseOutput } from '@usecase/base';
import {
  UsecaseError,
  UsecaseErrorCode,
  UsecaseErrorDetailCode,
} from '@usecase/exception';
import { ApiProperty } from '@nestjs/swagger';
import ApiResultDto from '@usecase/dto/api-result';
import { CommentFactory } from '@infrastructure/factory/comment';
import { ICommentRepository } from '@domain/repository/comment';

export class CommentPostUsecaseInput extends UsecaseInput {
  @ApiProperty({
    description: 'Comment content',
    type: String,
    required: true,
  })
  content: string;
}

export class CommentPostUsecaseOutput extends UsecaseOutput {
  @ApiProperty({
    description: 'Api Result',
    type: ApiResultDto,
  })
  result: ApiResultDto;
}

const commentFactory = new CommentFactory();

@Injectable()
export default class CommentPostUsecase extends Usecase<
  CommentPostUsecaseInput,
  CommentPostUsecaseOutput
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
    input: CommentPostUsecaseInput,
    { postId, userId }: { postId: number; userId: number },
  ): Promise<CommentPostUsecaseOutput> {
    const userEntity = await this.userRepository.getById(null, userId);

    if (!userEntity) {
      throw new UsecaseError({
        code: UsecaseErrorCode.NOT_FOUND,
        message: 'User does not exist',
        info: {
          detailCode: UsecaseErrorDetailCode.USER_NOT_EXIST,
        },
      });
    }

    const postEntity = await this.postRepository.getById(null, postId);

    if (!postEntity) {
      throw new UsecaseError({
        code: UsecaseErrorCode.NOT_FOUND,
        message: 'Post does not exist',
        info: {
          detailCode: UsecaseErrorDetailCode.POST_NOT_EXIST,
        },
      });
    }

    if (!input.content.length) {
      throw new UsecaseError({
        code: UsecaseErrorCode.BAD_REQUEST,
        message: 'Content can not be empty',
        info: {
          detailCode: UsecaseErrorDetailCode.COMMENT_CONTENT_CAN_NOT_EMPTY,
        },
      });
    }

    const comment = commentFactory.reconstruct({
      postId,
      userId,
      content: input.content,
    });

    try {
      await this.transactionManager.transaction(async (transaction) => {
        await this.commentRepository.save(transaction, comment);
      });
    } catch (err) {
      throw new UsecaseError({
        code: UsecaseErrorCode.INTERNAL_SERVER_ERROR,
        message: 'Internal Server Error',
      });
    }

    const output = new CommentPostUsecaseOutput();
    output.result = ApiResultDto.ok();

    return output;
  }
}
