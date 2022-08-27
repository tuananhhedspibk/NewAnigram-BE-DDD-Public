import { Expose } from '@nestjs/class-transformer';
import { BaseEntity } from '../base';

export class ImageEntity extends BaseEntity {
  @Expose()
  url: string;
}
