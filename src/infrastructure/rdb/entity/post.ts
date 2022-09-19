/* eslint-disable @typescript-eslint/no-unused-vars */

import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import BaseEntity from './base';
import CommentEntity from './comment';
import Like from './like';
import User from './user';

@Entity()
export default class Post extends BaseEntity {
  @Column()
  content: string;

  @Column()
  tags: string;

  @Column()
  images: string;

  @Column()
  userId: number;

  @ManyToOne((type) => User, (user) => user.posts)
  @JoinColumn({ name: 'user_id' })
  public user: User;

  @OneToMany((type) => Like, (like) => like.post)
  public likes: Like[];

  @OneToMany((type) => CommentEntity, (comment) => comment.post)
  public comments: Comment[];
}
