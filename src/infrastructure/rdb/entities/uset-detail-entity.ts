import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import BaseEntity from './base';
import User from './user-entity';

const Gender = {
  Male: 'Male',
  Female: 'Female',
} as const;

export type Gender = typeof Gender[keyof typeof Gender];

@Entity()
export default class UserDetail extends BaseEntity {
  @Column()
  nickName: string;

  @Column()
  avatarURL: string;

  @Column({
    type: 'enum',
    enum: Gender,
  })
  gender: Gender;

  @Column({
    nullable: false,
  })
  userId: number;

  @OneToOne((type) => User, (user) => user.userDetail)
  @JoinColumn({ name: 'user_id' })
  public user: User;
}
