/* eslint-disable @typescript-eslint/no-unused-vars */

import { PostEntity } from '@domain/entity/post';
import { IImageRepository, DomainImageType } from '@domain/repository/image';
import { IPostRepository } from '@domain/repository/post';
import ITransactionManager from '@domain/repository/transaction';
import { IUserRepository } from '@domain/repository/user';
import { InfrastructureError } from '@infrastructure/exception';
import { PostFactory } from '@infrastructure/factory/post';
import { Inject, Injectable } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import ApiResultDto from '@usecase/dto/api-result';
import {
  UsecaseError,
  UsecaseErrorCode,
  UsecaseErrorDetailCode,
} from '@usecase/exception';
import { Usecase, UsecaseInput, UsecaseOutput } from '../../base';

export class CreatePostUsecaseInput extends UsecaseInput {
  @ApiProperty({
    description: 'Post content',
    required: false,
    type: String,
  })
  content?: string;

  @ApiProperty({
    description: 'Post tags list',
    required: false,
    type: [String],
    isArray: true,
  })
  tags?: string[];

  @ApiProperty({
    description: 'Images list',
    required: true,
    type: [String],
    format: 'binary',
  })
  images: FixType;
}

export class PostDto {
  @ApiProperty({
    description: 'Post id',
    required: true,
    type: Number,
  })
  id: number;

  @ApiProperty({
    description: 'Post image urls',
    required: true,
    type: [String],
  })
  images: string[];

  @ApiProperty({
    description: 'Post tags list',
    required: true,
    type: [String],
  })
  tags: string[];

  @ApiProperty({
    description: 'Post content',
    required: true,
    type: String,
  })
  content: string;

  @ApiProperty({
    description: 'Post created date',
    required: true,
    type: Date,
  })
  createdAt: Date;

  constructor({
    id,
    images,
    tags,
    content,
    createdAt,
  }: {
    id: number;
    images: string[];
    tags: string[];
    content: string;
    createdAt: Date;
  }) {
    this.id = id;
    this.images = images;
    this.tags = tags;
    this.content = content;
    this.createdAt = createdAt;
  }
}

export class CreatePostUsecaseOutput extends UsecaseOutput {
  @ApiProperty({
    description: 'API result',
    type: ApiResultDto,
    required: true,
  })
  result: ApiResultDto;

  @ApiProperty({
    description: 'Post DTO',
    type: PostDto,
    required: true,
  })
  post: PostDto;
}

const postFactory = new PostFactory();

const MAX_NUMBER_PICS_OF_POST = 10;

@Injectable()
export default class CreatePostUsecase extends Usecase<
  CreatePostUsecaseInput,
  CreatePostUsecaseOutput
> {
  constructor(
    @Inject(IUserRepository) private readonly userRepository: IUserRepository,
    @Inject(IImageRepository)
    private readonly imageRepository: IImageRepository,
    @Inject(IPostRepository) private readonly postRepository: IPostRepository,
    @Inject(ITransactionManager)
    private readonly transactionManager: ITransactionManager,
  ) {
    super();
  }

  async execute(
    input: CreatePostUsecaseInput,
    userId: number,
  ): Promise<CreatePostUsecaseOutput> {
    const userEntity = this.userRepository.getById(null, userId);

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

    if (!input.images || input.images.length === 0) {
      throw new UsecaseError({
        code: UsecaseErrorCode.BAD_REQUEST,
        message: 'Post must have at least one image',
        info: {
          detailCode: UsecaseErrorDetailCode.POST_MUST_HAVE_IMAGE,
        },
      });
    }

    if (input.images.length > MAX_NUMBER_PICS_OF_POST) {
      throw new UsecaseError({
        code: UsecaseErrorCode.BAD_REQUEST,
        message: 'Post can have maximum 10 pictures',
        info: {
          detailCode: UsecaseErrorDetailCode.NUMBER_OF_PICS_LIMITED,
        },
      });
    }

    const newPostEntity = postFactory.createNewPostEntity(
      input.content,
      [],
      input.tags,
      userId,
    );

    let createdPostEntity: PostEntity;

    try {
      await this.transactionManager.transaction(
        async (transaction: TransactionType): Promise<void> => {
          createdPostEntity = await this.postRepository.save(
            transaction,
            newPostEntity,
          );
          const imagesInfo = {};
          const imageGetUrls = [];

          input.images.forEach((image) => {
            const imageInfoPayload = {
              name: image.originalname,
              type: image.mimetype,
              data: image.buffer,
              userId,
              postId: createdPostEntity.id,
            };

            const imageKey = this.imageRepository.generateKey(
              DomainImageType.POST_IMAGE,
              imageInfoPayload,
            );

            imageGetUrls.push(this.imageRepository.generateGetURL(imageKey));
            imagesInfo[imageKey] = imageInfoPayload;
          });

          const uploadImagePromises = Object.keys(imagesInfo).map((imageKey) =>
            this.imageRepository.uploadImageToImageServer(
              imageKey,
              imagesInfo[imageKey],
            ),
          );

          await Promise.all(uploadImagePromises);

          createdPostEntity.updateImages(imageGetUrls);

          await this.postRepository.update(transaction, createdPostEntity);
        },
      );
    } catch (error) {
      if (error instanceof InfrastructureError) {
        throw error;
      } else {
        throw new UsecaseError({
          code: UsecaseErrorCode.INTERNAL_SERVER_ERROR,
          message: 'Internal Server Error',
        });
      }
    }

    const output = new CreatePostUsecaseOutput();
    output.result = ApiResultDto.ok();
    let postDto: PostDto;

    if (createdPostEntity) {
      postDto = new PostDto({
        id: createdPostEntity.id,
        images: createdPostEntity.images,
        tags: createdPostEntity.tags,
        content: createdPostEntity.content,
        createdAt: createdPostEntity.createdAt,
      });
    }

    output.post = postDto;

    return output;
  }
}
