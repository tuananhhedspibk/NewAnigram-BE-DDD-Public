/* eslint-disable @typescript-eslint/no-unused-vars */
import { Column, Entity, OneToMany, OneToOne } from 'typeorm';
import BaseEntity from './base';
import Post from './post-entity';
import UserDetail from './uset-detail-entity';
import Like from './like-entity';
import Comment from './comment-entity';
import Notification from './notification-entity';
import Follow from './follow-entity';

@Entity()
export default class User extends BaseEntity {
  @Column({
    unique: true,
  })
  email: string;

  @Column()
  password: string;

  @Column()
  userName: string;

  @Column()
  salt: string;

  @OneToOne((_type) => UserDetail, (userDetail) => userDetail.user)
  public userDetail: UserDetail;

  @OneToMany((_type) => Post, (post) => post.user)
  public posts: Post[];

  @OneToMany((_type) => Like, (like) => like.user)
  public likes: Like[];

  @OneToMany((_type) => Comment, (comment) => comment.user)
  public comments: Comment[];

  @OneToMany((_type) => Notification, (notification) => notification.sourceUser)
  public sentNotifications: Notification[];

  @OneToMany((_type) => Notification, (notification) => notification.owner)
  public ownNotifications: Notification[];

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  @OneToMany((_type) => Follow, (follow) => follow.sourceUser)
  public followers: Follow[];

  @OneToMany((_type) => Follow, (follow) => follow.destinationUser)
  public followings: Follow[];
}
