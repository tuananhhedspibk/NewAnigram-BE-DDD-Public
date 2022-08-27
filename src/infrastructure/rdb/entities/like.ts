import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import BaseEntity from './base';
import Post from './post';
import User from './user';

@Entity()
export default class Like extends BaseEntity {
  @Column()
  userId: number;

  @Column()
  postId: number;

  @ManyToOne((type) => User, (user) => user.likes)
  @JoinColumn({ name: 'user_id' })
  public user: User;

  @ManyToOne((type) => Post, (post) => post.likes)
  @JoinColumn({ name: 'post_id' })
  public post: Post;
}
