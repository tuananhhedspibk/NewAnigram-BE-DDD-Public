/* eslint-disable @typescript-eslint/no-unused-vars */

import { Expose, Type } from '@nestjs/class-transformer';

import { Gender } from '@infrastructure/rdb/entity/user-detail';
import BaseDto from './base';

class UserProfileDetailDto extends BaseDto {
  @Expose()
  nickName: string;

  @Expose()
  avatarURL: string;

  @Expose()
  gender: Gender;

  constructor() {
    super();
  }
}

export class UserProfileDto extends BaseDto {
  @Expose()
  email: string;

  @Expose()
  userName: string;

  @Expose()
  @Type(() => UserProfileDetailDto)
  detail: UserProfileDetailDto;

  constructor() {
    super();
  }
}
