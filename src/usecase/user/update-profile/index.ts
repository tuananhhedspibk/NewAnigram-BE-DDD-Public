/* eslint-disable @typescript-eslint/no-unused-vars */

import { UpdateDetailParams } from '@domain/entity/user';
import { UserDetailGender } from '@domain/entity/user/user-detail';
import IImageRepository, {
  ImageInfoPayload,
  ImageType,
} from '@domain/repository/image';
import ITransactionManager from '@domain/repository/transaction';
import { IUserRepository } from '@domain/repository/user';
import {
  InfrastructureError,
  InfrastructureErrorCode,
  InfrastructureErrorDetailCode,
} from '@infrastructure/exception';
import { Inject, Injectable } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { Usecase, UsecaseInput, UsecaseOutput } from '@usecase/base';
import ApiResultDto from '@usecase/dto/api-result';
import {
  UsecaseError,
  UsecaseErrorCode,
  UsecaseErrorDetailCode,
} from '@usecase/exception';

export class UpdateUserProfileUsecaseInput extends UsecaseInput {
  @ApiProperty({
    description: 'User nick name',
    required: false,
    type: String,
  })
  nickName?: string;

  @ApiProperty({
    description: 'New avatar',
    required: false,
    type: File,
  })
  avatar?: File;

  @ApiProperty({
    description: 'User gender',
    required: false,
    enum: UserDetailGender,
  })
  gender?: UserDetailGender;

  @ApiProperty({
    description: 'User name',
    required: false,
    type: String,
  })
  userName?: string;

  @ApiProperty({
    description: 'Email',
    required: false,
    type: String,
  })
  email?: string;

  @ApiProperty({
    description: 'New password',
    required: false,
    type: String,
  })
  newPassword?: string;
}

export class UpdateUserProfileUsecaseOutput extends UsecaseOutput {
  @ApiProperty({
    description: 'API result',
    type: ApiResultDto,
    required: true,
  })
  result: ApiResultDto;
}

@Injectable()
export default class UpdateUserProfileUsecase extends Usecase<
  UpdateUserProfileUsecaseInput,
  UpdateUserProfileUsecaseOutput
> {
  constructor(
    @Inject(IUserRepository) private readonly userRepository: IUserRepository,
    @Inject(IImageRepository)
    private readonly imageRepository: IImageRepository,
    @Inject(ITransactionManager)
    private readonly transactionManager: ITransactionManager,
  ) {
    super();
  }

  async execute(
    input: UpdateUserProfileUsecaseInput,
    userId: number,
  ): Promise<UpdateUserProfileUsecaseOutput> {
    const userEntity = await this.userRepository.getById(null, userId);

    if (!userEntity) {
      throw new UsecaseError({
        code: UsecaseErrorCode.NOT_FOUND,
        message: 'User not exist',
        info: {
          errorCode: UsecaseErrorDetailCode.USER_NOT_EXIST,
        },
      });
    }

    let imageInfoPayload: ImageInfoPayload = null;
    let avatarGetURL = '';

    if (input.avatar) {
      imageInfoPayload = {
        name: input.avatar.name,
        type: input.avatar.type,
        data: input.avatar,
        userId,
      };

      const imageKey = this.imageRepository.generateKey(
        ImageType.USER_AVATAR,
        imageInfoPayload,
      );
      avatarGetURL = this.imageRepository.generateGetURL(imageKey);
    }

    const updateUserDetailParams = this.makeUpdateUserDetailParams(
      input,
      avatarGetURL,
    );
    const oldAvatarURL = userEntity.detail?.avatarURL || '';

    if (updateUserDetailParams) {
      userEntity.updateDetail(updateUserDetailParams);
    }

    if (input.email) {
      userEntity.updateEmail(input.email);
    }

    if (input.userName) {
      userEntity.updateUserName(input.userName);
    }

    try {
      await this.transactionManager.transaction(
        async (transaction: TransactionType): Promise<void> => {
          await this.userRepository.save(transaction, userEntity);
        },
      );

      if (imageInfoPayload) {
        await this.imageRepository.uploadImageToImageServer(
          ImageType.USER_AVATAR,
          imageInfoPayload,
        );
      }
    } catch (error) {
      if (error instanceof InfrastructureError) {
        if (
          error.code === InfrastructureErrorCode.INTERNAL_SERVER_ERROR &&
          error.info.errorCode ===
            InfrastructureErrorDetailCode.UPLOAD_IMAGE_TO_IMAGE_SERVER_FAILED
        ) {
          userEntity.updateDetail({ avatarURL: oldAvatarURL });

          await this.transactionManager.transaction(
            async (transaction: TransactionType): Promise<void> => {
              await this.userRepository.save(transaction, userEntity);
            },
          );
        }
      }

      throw new UsecaseError({
        code: UsecaseErrorCode.INTERNAL_SERVER_ERROR,
        message: 'Internal Server Error',
      });
    }

    const output = new UpdateUserProfileUsecaseOutput();
    output.result = ApiResultDto.ok();

    return output;
  }

  private makeUpdateUserDetailParams(
    input: UpdateUserProfileUsecaseInput,
    avatarGetURL: string,
  ): UpdateDetailParams | null {
    const updateUserDetailParams: UpdateDetailParams = null;
    if (avatarGetURL.length > 0) {
      updateUserDetailParams.avatarURL = avatarGetURL;
    }

    if (input.nickName !== null) {
      updateUserDetailParams.nickName = input.nickName;
    }

    if (input.gender) {
      updateUserDetailParams.gender = input.gender;
    }

    return updateUserDetailParams;
  }
}
