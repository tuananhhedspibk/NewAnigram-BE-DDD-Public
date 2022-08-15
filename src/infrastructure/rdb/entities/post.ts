import { Column, Entity } from 'typeorm';
import BaseEntity from './base';

@Entity()
export default class Post extends BaseEntity {
  @Column()
  content: string;

  @Column()
  tags: string[];

  @Column()
  images: string[];

  @Column()
  userId: number;
}
