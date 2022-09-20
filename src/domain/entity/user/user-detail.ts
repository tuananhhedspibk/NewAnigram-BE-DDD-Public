/* eslint-disable @typescript-eslint/no-unused-vars */

import { Expose } from '@nestjs/class-transformer';
import { BaseEntity } from '../base';

export enum UserDetailGender {
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
  avatarURL: string;

  @Expose()
  gender: UserDetailGender;

  constructor() {
    super();
  }

  get isActive() {
    return this.active;
  }
}
