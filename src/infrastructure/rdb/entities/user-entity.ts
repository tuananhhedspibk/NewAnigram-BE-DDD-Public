import { Column, Entity, OneToMany, OneToOne } from 'typeorm';
import BaseEntity from './base';
import Post from './post-entity';
import UserDetail from './uset-detail-entity';
import Like from './like-entity';
import Comment from './comment-entity';
import Notification from './notification-entity';

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

  @OneToOne((type) => UserDetail, (userDetail) => userDetail.user)
  public userDetail: UserDetail;

  @OneToMany((type) => Post, (post) => post.user)
  public posts: Post[];

  @OneToMany((type) => Like, (like) => like.user)
  public likes: Like[];

  @OneToMany((type) => Comment, (comment) => comment.user)
  public comments: Comment[];

  @OneToMany((type) => Notification, (notification) => notification.sourceUser)
  public sentNotifications: Notification[];

  @OneToMany((type) => Notification, (notification) => notification.owner)
  public ownNotifications: Notification[];
}
