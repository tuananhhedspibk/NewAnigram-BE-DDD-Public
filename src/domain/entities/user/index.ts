import { Expose, Type } from '@nestjs/class-transformer';
import { EmailVO } from '../../value-objects/email-vo';
import { BaseEntity } from '../base';
import { UserDetailEntity } from './user-detail';

export class UserEntity extends BaseEntity {
  @Expose()
  id?: number;

  @Expose()
  @Type(() => EmailVO)
  email: EmailVO;

  @Expose()
  @Type(() => UserDetailEntity)
  detail: UserDetailEntity;

  constructor() {
    super();
  }
}
