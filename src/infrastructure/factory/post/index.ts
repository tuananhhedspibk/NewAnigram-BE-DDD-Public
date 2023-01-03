import { PostEntity } from '@domain/entity/post';
import { ImageEntity } from '@domain/entity/post/image';
import { BaseFactory } from '../base';

export class PostFactory extends BaseFactory {
  createNewPostEntity(content: string, imageUrls: string[], tags: string[]) {
    const entity = this.createEntity(PostEntity, {
      content,
      tags,
      images: imageUrls.map((url) => {
        const imageEntity = new ImageEntity();
        imageEntity.url = url;
        return imageEntity;
      }),
    });

    return entity;
  }
}
