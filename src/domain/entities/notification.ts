import { Expose } from '@nestjs/class-transformer';
import { BaseEntity } from './base';

export const NotifyType = {
  LikePost: 'LikePost',
  CommentPost: 'CommentPost',
} as const;

export type NotifyType = typeof NotifyType[keyof typeof NotifyType];

export class NotificationEntity extends BaseEntity {
  @Expose()
  id?: number;

  @Expose()
  ownerId: number;

  @Expose()
  sourceUserId: number;

  @Expose()
  postId: number;

  @Expose()
  content: string;

  @Expose()
  type: NotifyType;

  @Expose()
  read: boolean;
}
