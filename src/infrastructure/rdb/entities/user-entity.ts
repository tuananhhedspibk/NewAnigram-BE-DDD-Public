import { Column, Entity, OneToOne } from 'typeorm';
import BaseEntity from './base';
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
}
