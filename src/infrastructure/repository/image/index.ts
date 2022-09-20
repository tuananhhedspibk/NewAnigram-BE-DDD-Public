import IImageRepository, {
  ImageType,
  ImageInfoPayload,
} from '@domain/repository/image';
import {
  InfrastructureError,
  InfrastructureErrorCode,
  InfrastructureErrorDetailCode,
} from '@infrastructure/exception';

import {
  generateS3GetURL,
  generateS3PutURL,
  uploadImageToS3Bucket,
} from '@utils/aws';

import { hashString } from '@utils/encrypt';

export default class ImageRepository implements IImageRepository {
  generateKey(imageType: ImageType, payload: ImageInfoPayload): string {
    const currentTimeStamp = new Date().getTime();
    const hashName = `${hashString(payload.name + currentTimeStamp)}.${
      payload.type.split('/')[1]
    }`;

    let key = '';

    switch (imageType) {
      case ImageType.USER_AVATAR:
        key = `users/${payload.userId}/avatars/${hashName}`;
        break;
      case ImageType.POST_IMAGE:
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

  async generatePutURL(key: string, contentType: string): Promise<string> {
    if (key.length === 0) {
      throw new InfrastructureError({
        code: InfrastructureErrorCode.BAD_REQUEST,
        message: 'Image key can not be empty',
        info: {
          errorCode: InfrastructureErrorDetailCode.IMAGE_KEY_CAN_NOT_BE_EMPTY,
        },
      });
    }

    try {
      const url = await generateS3PutURL(key, contentType);

      return url;
    } catch (err) {
      throw new InfrastructureError({
        code: InfrastructureErrorCode.INTERNAL_SERVER_ERROR,
        message: 'Get put url failed',
        info: {
          errorCode: InfrastructureErrorDetailCode.CAN_NOT_GET_PUT_URL,
          errorContent: JSON.stringify(err),
          contentType,
          key,
        },
      });
    }
  }

  async uploadImageToImageServer(
    imageType: ImageType,
    payload: ImageInfoPayload,
  ): Promise<void> {
    try {
      const key = this.generateKey(imageType, payload);
      const url = await this.generatePutURL(key, payload.type);
      await uploadImageToS3Bucket(url, payload.data);
    } catch (err) {
      throw new InfrastructureError({
        code: InfrastructureErrorCode.INTERNAL_SERVER_ERROR,
        message: 'Update image to image server failed',
        info: {
          errorCode:
            InfrastructureErrorDetailCode.UPLOAD_IMAGE_TO_IMAGE_SERVER_FAILED,
          errorContent: JSON.stringify(err),
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
