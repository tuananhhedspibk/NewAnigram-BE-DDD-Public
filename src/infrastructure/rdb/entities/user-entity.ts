import { Column, Entity, OneToMany, OneToOne } from 'typeorm';
import BaseEntity from './base';
import Post from './post';
import UserDetail from './uset-detail-entity';

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
}
