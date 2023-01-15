import { Expose } from '@nestjs/class-transformer';
import { BaseEntity } from '../base';

export class CommentEntity extends BaseEntity {
  @Expose()
  id?: number;

  @Expose()
  content: string;

  @Expose()
  userId: number;

  @Expose()
  postId: number;

  isCreatedBy(userId: number) {
    return this.userId === userId;
  }

  isCommentOfPost(postId: number) {
    return this.postId === postId;
  }
}
