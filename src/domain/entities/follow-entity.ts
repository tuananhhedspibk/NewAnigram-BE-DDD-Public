import { Expose } from '@nestjs/class-transformer';
import { BaseEntity } from './base';

export class FollowEntity extends BaseEntity {
  @Expose()
  id?: number;

  @Expose()
  sourceUserId: number;

  @Expose()
  destinationUserId: number;
}
