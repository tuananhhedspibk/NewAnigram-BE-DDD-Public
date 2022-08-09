import { Expose, Type } from '@nestjs/class-transformer';
import { BaseEntity } from '../base';
import { CommentEntity } from './comment-entity';
import { ImageEntity } from './image-entity';
import { LikeEntity } from './like-entity';

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
}
