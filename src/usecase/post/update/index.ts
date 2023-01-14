/* eslint-disable @typescript-eslint/no-unused-vars */

import { Inject, Injectable } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';

import { IPostRepository } from '@domain/repository/post';
import ITransactionManager from '@domain/repository/transaction';
import { IUserRepository } from '@domain/repository/user';

import { UsecaseInput, UsecaseOutput, Usecase } from '@usecase/base';
import ApiResultDto from '@usecase/dto/api-result';
import {
  UsecaseError,
  UsecaseErrorCode,
  UsecaseErrorDetailCode,
} from '@usecase/exception';

export class UpdatePostUsecaseInput extends UsecaseInput {
  @ApiProperty({
    description: 'Post id',
    required: true,
    type: Number,
  })
  id: number;

  @ApiProperty({
    description: 'Post new content',
    required: false,
    type: String,
  })
  content?: string;

  @ApiProperty({
    description: 'Post new tags',
    required: false,
    type: [String],
  })
  tags?: string[];
}

export class UpdatedPostDto {
  @ApiProperty({
    description: 'Post id',
    required: true,
    type: Number,
  })
  id: number;

  @ApiProperty({
    description: 'Post content',
    required: true,
    type: String,
  })
  content: string;

  @ApiProperty({
    description: 'Post tags',
    required: true,
    type: [String],
  })
  tags: string[];

  constructor({
    id,
    content,
    tags,
  }: {
    id: number;
    content: string;
    tags: string[];
  }) {
    this.id = id;
    this.content = content;
    this.tags = tags;
  }
}

export class UpdatePostUsecaseOutput extends UsecaseOutput {
  @ApiProperty({
    description: 'API result',
    type: ApiResultDto,
    required: true,
  })
  result: ApiResultDto;

  @ApiProperty({
    description: 'Updated Post DTO',
    type: UpdatedPostDto,
    required: true,
  })
  post: UpdatedPostDto;
}

@Injectable()
export default class UpdatePostUsecase extends Usecase<
  UsecaseInput,
  UsecaseOutput
> {
  constructor(
    @Inject(IUserRepository) private readonly userRepository: IUserRepository,
    @Inject(IPostRepository) private readonly postRepository: IPostRepository,
    @Inject(ITransactionManager)
    private readonly transactionManager: ITransactionManager,
  ) {
    super();
  }

  async execute(
    input: UpdatePostUsecaseInput,
    userId: number,
  ): Promise<UpdatePostUsecaseOutput> {
    const userEntity = await this.userRepository.getById(null, userId);
    const output = new UpdatePostUsecaseOutput();

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
        },
      });
    }

    if (!postEntity.isCreatedBy(userId)) {
      throw new UsecaseError({
        code: UsecaseErrorCode.BAD_REQUEST,
        message: 'Unauthorized to update post',
        info: {
          detailCode: UsecaseErrorDetailCode.UNAUTHORIZED_TO_UPDATE_POST,
          postId: input.id,
          userId,
        },
      });
    }

    if (!input.content && !input.tags) {
      output.result = ApiResultDto.ok();
      output.post = new UpdatedPostDto({
        id: postEntity.id,
        content: postEntity.content,
        tags: postEntity.tags,
      });

      return output;
    }

    if (input.content) {
      postEntity.updateContent(input.content);
    }

    if (input.tags) {
      postEntity.updateTags(input.tags);
    }

    try {
      await this.transactionManager.transaction(async (transaction) => {
        await this.postRepository.update(transaction, postEntity);
      });
    } catch (error) {
      throw new UsecaseError({
        code: UsecaseErrorCode.INTERNAL_SERVER_ERROR,
        message: 'Internal Server Error',
      });
    }

    output.result = ApiResultDto.ok();
    output.post = new UpdatedPostDto({
      id: postEntity.id,
      content: postEntity.content,
      tags: postEntity.tags,
    });

    return output;
  }
}
