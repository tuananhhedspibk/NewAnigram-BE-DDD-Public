import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import BaseEntity from './base';
import User from './user';

@Entity()
export default class Follow extends BaseEntity {
  @Column()
  sourceUserId: number;

  @Column()
  destinationUserId: number;

  @ManyToOne((type) => User, (user) => user.followings)
  @JoinColumn({ name: 'destination_user_id' })
  public destinationUser: User;

  @ManyToOne((type) => User, (user) => user.followers)
  @JoinColumn({ name: 'source_user_id' })
  public sourceUser: User;
}
