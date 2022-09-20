import { BaseRepository } from './base';

export enum ImageType {
  USER_AVATAR = 'USER_AVATAR',
  POST_IMAGE = 'POST_IMAGE',
}

export type ImageInfoPayload = {
  name: string;
  type: string;
  data: File;
  userId: number;
  postId?: number;
};

export default class IImageRepository extends BaseRepository {
  uploadImageToImageServer: (
    imageType: ImageType,
    payload: ImageInfoPayload,
  ) => Promise<void>;
  generateKey: (imageType: ImageType, payload: ImageInfoPayload) => string;
  generatePutURL: (key: string, contentType: string) => Promise<string>;
  generateGetURL: (key: string) => string;
}
