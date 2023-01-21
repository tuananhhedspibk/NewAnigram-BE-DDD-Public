/* eslint-disable @typescript-eslint/no-unused-vars */

import { Expose } from '@nestjs/class-transformer';
import BaseDto from './base';

class UserDto {
  @Expose()
  id: number;

  @Expose()
  userName: string;

  @Expose()
  avatarURL: string;
}

export class UserFeedPostLikeDto {
  @Expose()
  id: number;
}

export class UserFeedPostCommentDto {
  @Expose()
  id: number;

  @Expose()
  user: UserDto;

  @Expose()
  content: string;

  @Expose()
  createdAt: Date;
}

export class UserFeedPostDto extends BaseDto {
  @Expose()
  id: number;

  @Expose()
  user: UserDto;

  @Expose()
  content: string;

  @Expose()
  tags: string[];

  @Expose()
  images: string[];

  @Expose()
  likes: UserFeedPostLikeDto[];

  @Expose()
  comments: UserFeedPostCommentDto[];

  @Expose()
  createdAt: Date;
}
