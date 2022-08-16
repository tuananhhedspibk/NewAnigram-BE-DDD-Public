import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import BaseEntity from './base';
import Post from './post-entity';
import User from './user-entity';

@Entity()
export default class Comment extends BaseEntity {
  @Column()
  content: string;

  @Column()
  userId: number;

  @Column()
  postId: number;

  @ManyToOne((type) => User, (user) => user.comments)
  @JoinColumn({ name: 'user_id' })
  public user: User;

  @ManyToOne((type) => Post, (post) => post.comments)
  @JoinColumn({ name: 'post_id' })
  public post: Post;
}
