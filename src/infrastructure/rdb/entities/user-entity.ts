import { Column, Entity } from 'typeorm';
import BaseEntity from './base';

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
}
