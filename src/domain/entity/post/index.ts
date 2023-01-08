import {
  DomainError,
  DomainErrorCode,
  DomainErrorDetailCode,
} from '@domain/exception';
import { Expose, Type } from '@nestjs/class-transformer';
import { BaseEntity } from '../base';
import { CommentEntity } from './comment';
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
  images: string[];

  @Expose()
  userId: number;

  @Expose()
  createdAt?: Date;

  updateImages(imageUrls: string[]) {
    this.images = imageUrls;
  }

  updateContent(newContent: string) {
    this.content = newContent;
  }

  updateTags(newTags: string[]) {
    this.tags = newTags;
  }

  isCreatedBy(userId: number) {
    return this.userId === userId;
  }
}
