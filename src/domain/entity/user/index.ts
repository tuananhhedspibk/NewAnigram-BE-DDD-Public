import { Expose, Type } from '@nestjs/class-transformer';
import { EmailVO } from '../../value-object/email-vo';
import { BaseEntity } from '../base';
import { UserDetailEntity } from './user-detail';

export class UserEntity extends BaseEntity {
  @Expose()
  id?: number;

  @Expose()
  @Type(() => EmailVO)
  email: EmailVO;

  @Expose()
  userName: string;

  @Expose()
  password?: string;

  @Expose()
  @Type(() => UserDetailEntity)
  detail: UserDetailEntity;

  constructor() {
    super();
  }
}
