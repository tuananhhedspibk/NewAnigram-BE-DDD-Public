import IImageRepository, {
  DomainImageType,
  ImageInfoPayload,
} from '@domain/repository/image';
import { IUserRepository } from '@domain/repository/user';
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
  })
  tags: [string];

  @ApiProperty({
    description: 'Images list',
    required: true,
    type: 'string',
    format: 'binary',
  })
  images: FixType;
}

export class CreatePostUsecaseOutput extends UsecaseOutput {
  @ApiProperty({
    description: 'API result',
    type: ApiResultDto,
    required: true,
  })
  result: ApiResultDto;
}

const postFactory = new PostFactory();

@Injectable()
export default class CreatePostUsecase extends Usecase<
  CreatePostUsecaseInput,
  CreatePostUsecaseOutput
> {
  constructor(
    @Inject(IUserRepository) private readonly userRepository: IUserRepository,
    @Inject(IImageRepository)
    private readonly imageRepository: IImageRepository,
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

    const imagesInfo = {};
    const imageGetUrls = [];

    input.images.forEach((image) => {
      const imageInfoPayload = {
        name: image.originalname,
        type: image.mimetype,
        data: image.buffer,
        userId,
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

    const postEntity = postFactory.createNewPostEntity(
      input.content,
      imageGetUrls,
      input.tags,
    );

    await Promise.all(uploadImagePromises);
  }
}
