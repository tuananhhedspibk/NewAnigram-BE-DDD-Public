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
  isActive: boolean;

  @Expose()
  nickName: string;

  @Expose()
  avatarUrl: string;

  @Expose()
  gender: UserDetailGender;
}
