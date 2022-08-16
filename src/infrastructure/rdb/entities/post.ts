import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import BaseEntity from './base';
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
}
