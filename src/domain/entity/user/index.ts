/* eslint-disable @typescript-eslint/no-unused-vars */

import {
  DomainError,
  DomainErrorCode,
  DomainErrorDetailCode,
} from '@domain/exception';
import { Expose, Type } from '@nestjs/class-transformer';
import { EmailVO } from '../../value-object/email-vo';
import { PasswordVO } from '../../value-object/password-vo';
import { BaseEntity } from '../base';
import { UserDetailEntity, UserDetailGender } from './user-detail';

export interface UpdateDetailParams {
  nickName?: string;
  gender?: UserDetailGender;
  avatarURL?: string;
}

export class UserEntity extends BaseEntity {
  @Expose()
  id?: number;

  @Expose()
  @Type(() => EmailVO)
  email: EmailVO;

  @Expose()
  userName: string;

  @Expose()
  @Type(() => PasswordVO)
  password?: PasswordVO;

  @Expose()
  @Type(() => UserDetailEntity)
  detail: UserDetailEntity;

  constructor() {
    super();
  }

  updateEmail(newEmail: string) {
    const newEmailVO = new EmailVO(newEmail);
    this.email = newEmailVO;
  }

  updatePassword(newPassword: string) {
    const newPasswordVO = new PasswordVO(newPassword);
    this.password = newPasswordVO;
  }

  updateUserName(newUserName: string) {
    if (newUserName.length === 0) {
      throw new DomainError({
        code: DomainErrorCode.BAD_REQUEST,
        message: 'User name can not be empty',
        info: {
          detailCode: DomainErrorDetailCode.USER_NAME_CAN_NOT_BE_EMPTY,
        },
      });
    }

    this.userName = newUserName;
  }

  updateDetail(params: UpdateDetailParams) {
    if (!this.detail) {
      this.detail = new UserDetailEntity();
    }

    if (params.avatarURL) {
      this.detail.avatarURL = params.avatarURL;
    }

    if (params.gender) {
      this.detail.gender = params.gender;
    }

    if (params.nickName !== null) {
      this.detail.nickName = params.nickName;
    }
  }
}
