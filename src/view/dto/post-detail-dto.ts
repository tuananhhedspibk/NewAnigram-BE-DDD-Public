import { Expose, Type } from '@nestjs/class-transformer';
import BaseDto from './base';

class UserDto {
  @Expose()
  id: number;

  @Expose()
  userName: string;
}

class LikeDto {
  @Expose()
  id: number;

  @Expose()
  @Type(() => UserDto)
  user: UserDto;
}

class CommentDto {
  @Expose()
  id: number;

  @Expose()
  content: string;

  @Expose()
  @Type(() => UserDto)
  user: UserDto;

  @Expose()
  createdAt: Date;
}

export class PostDetailDto extends BaseDto {
  @Expose()
  id: number;

  @Expose()
  content: string;

  @Expose()
  tags: string[];

  @Expose()
  images: string[];

  @Expose()
  @Type(() => UserDto)
  user: UserDto;

  @Expose()
  @Type(() => LikeDto)
  likes: LikeDto[];

  @Expose()
  @Type(() => CommentDto)
  comments: CommentDto[];

  @Expose()
  createdAt: Date;
}
