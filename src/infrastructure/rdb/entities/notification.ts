import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import BaseEntity from './base';
import User from './user';

const NotificationType = {
  FollowNotify: 'FollowNotify',
  PostLikeNotify: 'PostLikeNotify',
  PostCommentNotify: 'PostCommentNotify',
} as const;

export type NotificationType =
  typeof NotificationType[keyof typeof NotificationType];

@Entity()
export default class Notification extends BaseEntity {
  @Column()
  ownerId: number;

  @Column()
  sourceUserId: number;

  @Column()
  content: string;

  @Column({
    nullable: true,
  })
  postId: number;

  @Column({
    type: 'enum',
    enum: NotificationType,
  })
  type: NotificationType;

  @Column()
  read: boolean;

  @Column()
  image: string;

  @ManyToOne((type) => User, (user) => user.ownNotifications)
  @JoinColumn({ name: 'owner_id' })
  public owner: User;

  @ManyToOne((type) => User, (user) => user.sentNotifications)
  @JoinColumn({ name: 'source_user_id' })
  public sourceUser: User;
}
