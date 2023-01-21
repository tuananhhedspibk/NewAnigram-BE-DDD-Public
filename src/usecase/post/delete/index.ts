/* eslint-disable @typescript-eslint/no-unused-vars */

import { ICommentRepository } from '@domain/repository/comment';
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

export class DeletePostUsecaseInput extends UsecaseInput {
  @ApiProperty({
    description: 'Post id',
    required: true,
    type: Number,
  })
  id: number;
}

export class DeletePostUsecaseOutput extends UsecaseOutput {
  @ApiProperty({
    description: 'API result',
    type: ApiResultDto,
  })
  result: ApiResultDto;
}

@Injectable()
export default class DeletePostUsecase extends Usecase<
  DeletePostUsecaseInput,
  DeletePostUsecaseOutput
> {
  constructor(
    @Inject(IUserRepository) private readonly userRepository: IUserRepository,
    @Inject(IPostRepository) private readonly postRepository: IPostRepository,
    @Inject(ILikeRepository) private readonly likeRepository: ILikeRepository,
    @Inject(ICommentRepository)
    private readonly commentRepository: ICommentRepository,
    @Inject(ITransactionManager)
    private readonly transactionManager: ITransactionManager,
  ) {
    super();
  }

  async execute(
    input: DeletePostUsecaseInput,
    userId: number,
  ): Promise<DeletePostUsecaseOutput> {
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

    const postEntity = await this.postRepository.getById(null, input.id);

    if (!postEntity) {
      throw new UsecaseError({
        code: UsecaseErrorCode.NOT_FOUND,
        message: 'Post does not exist',
        info: {
          detailCode: UsecaseErrorDetailCode.POST_NOT_EXIST,
          postId: input.id,
          userId,
        },
      });
    }

    if (!postEntity.isCreatedBy(userId)) {
      throw new UsecaseError({
        code: UsecaseErrorCode.BAD_REQUEST,
        message: 'Unauthorized to delete post',
        info: {
          detailCode: UsecaseErrorDetailCode.UNAUTHORIZED_TO_DELETE_POST,
          postId: input.id,
          userId,
        },
      });
    }

    try {
      await this.transactionManager.transaction(async (transaction) => {
        const deletePostLikes = postEntity.likes.map((like) =>
          this.likeRepository.deleteById(transaction, like.id),
        );
        const deletePostComments = postEntity.comments.map((comment) =>
          this.commentRepository.deleteById(transaction, comment.id),
        );

        await Promise.all([...deletePostLikes, ...deletePostComments]);

        await this.postRepository.deleteById(transaction, postEntity.id);
      });
    } catch (err) {
      console.log(err);
      throw new UsecaseError({
        code: UsecaseErrorCode.INTERNAL_SERVER_ERROR,
        message: 'Internal Server Error',
      });
    }

    const output = new DeletePostUsecaseOutput();
    output.result = ApiResultDto.ok();

    return output;
  }
}
