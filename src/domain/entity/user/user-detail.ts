import { Expose } from '@nestjs/class-transformer';
import { BaseEntity } from '../base';

enum UserDetailGender {
  Male = 'Male',
  Female = 'Female',
}

export class UserDetailEntity extends BaseEntity {
  @Expose()
  id?: number;

  @Expose()
  active: boolean;

  @Expose()
  nickName: string;

  @Expose()
  avatarUrl: string;

  @Expose()
  gender: UserDetailGender;

  constructor() {
    super();
  }

  get isActive() {
    return this.active;
  }
}
