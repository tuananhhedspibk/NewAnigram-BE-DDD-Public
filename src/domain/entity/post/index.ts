import { Expose, Type } from '@nestjs/class-transformer';
import { BaseEntity } from '../base';
import { CommentEntity } from './comment';
import { ImageEntity } from './image';
import { LikeEntity } from './like';

export class PostEntity extends BaseEntity {
  @Expose()
  id?: number;

  @Expose()
  @Type(() => LikeEntity)
  likes: LikeEntity[];

  @Expose()
  @Type(() => CommentEntity)
  comments: CommentEntity[];

  @Expose()
  tags: string[];

  @Expose()
  content: string;

  @Expose()
  @Type(() => ImageEntity)
  images: ImageEntity[];

  @Expose()
  userId: number;

  @Expose()
  createdAt?: Date;

  updateImages(imageUrls: string[]) {
    const newImageEntities = imageUrls.map((url) => {
      const imageEntity = new ImageEntity();
      imageEntity.url = url;

      return imageEntity;
    });

    this.images = newImageEntities;
  }
}
