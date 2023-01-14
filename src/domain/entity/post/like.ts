import { Expose } from '@nestjs/class-transformer';
import { BaseEntity } from '../base';

export class LikeEntity extends BaseEntity {
  @Expose()
  id?: number;

  @Expose()
  userId: number;

  @Expose()
  postId: number;
}
