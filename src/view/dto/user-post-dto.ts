import { Expose } from '@nestjs/class-transformer';
import BaseDto from './base';

export class UserPostDto extends BaseDto {
  @Expose()
  id: number;

  @Expose()
  likesCount: number;

  @Expose()
  commentsCount: number;

  @Expose()
  thumbnail: string;
}
