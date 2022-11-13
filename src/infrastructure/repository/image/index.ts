import IImageRepository, {
  DomainImageType,
  ImageInfoPayload,
} from '@domain/repository/image';
import {
  InfrastructureError,
  InfrastructureErrorCode,
  InfrastructureErrorDetailCode,
} from '@infrastructure/exception';

import { generateS3GetURL, uploadImageToS3Bucket } from '@utils/aws';

import { hashString } from '@utils/encrypt';

export default class ImageRepository implements IImageRepository {
  generateKey(
    domainImageType: DomainImageType,
    payload: ImageInfoPayload,
  ): string {
    const currentTimeStamp = new Date().getTime();
    const hashName = `${hashString(payload.name + currentTimeStamp)}.${
      payload.type.split('/')[1]
    }`;

    let key = '';

    switch (domainImageType) {
      case DomainImageType.USER_AVATAR:
        key = `users/${payload.userId}/avatars/${hashName}`;
        break;
      case DomainImageType.POST_IMAGE:
      default:
        key = `users/${payload.userId}/posts/${payload.postId}/${hashName}`;
        break;
    }

    return key;
  }

  generateGetURL(key: string): string {
    if (key.length === 0) {
      throw new InfrastructureError({
        code: InfrastructureErrorCode.BAD_REQUEST,
        message: 'Image key can not be empty',
        info: {
          errorCode: InfrastructureErrorDetailCode.IMAGE_KEY_CAN_NOT_BE_EMPTY,
        },
      });
    }

    return generateS3GetURL(key);
  }

  async uploadImageToImageServer(
    key: string,
    payload: ImageInfoPayload,
  ): Promise<void> {
    try {
      await uploadImageToS3Bucket(key, payload.data);
    } catch (err) {
      console.error(err.stack);

      throw new InfrastructureError({
        code: InfrastructureErrorCode.INTERNAL_SERVER_ERROR,
        message: 'Upload image to image server failed',
        info: {
          errorCode:
            InfrastructureErrorDetailCode.UPLOAD_IMAGE_TO_IMAGE_SERVER_FAILED,
          errorContent: JSON.stringify(err.stack),
          image: {
            name: payload.name,
            type: payload.type,
            userId: payload.userId,
            postId: payload.postId,
          },
        },
      });
    }
  }
}
