import { BaseRepository } from './base';

export enum DomainImageType {
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
    key: string,
    payload: ImageInfoPayload,
  ) => Promise<void>;
  generateKey: (
    domainImageType: DomainImageType,
    payload: ImageInfoPayload,
  ) => string;
  generateGetURL: (key: string) => string;
}
