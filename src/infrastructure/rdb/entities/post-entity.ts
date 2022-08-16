import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import BaseEntity from './base';
import CommentEntity from './comment-entity';
import Like from './like-entity';
import User from './user-entity';

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
