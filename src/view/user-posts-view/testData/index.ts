import { plainToClass } from '@nestjs/class-transformer';

import { UserProfileDto } from '@view/dto/user-profile-dto';
import { UserPostDto } from '@view/dto/user-post-dto';

import { Gender } from '@infrastructure/rdb/entity/user-detail';

const userProfileDto = plainToClass(UserProfileDto, {
  email: 'test@mail.com',
  userName: 'userName',
  detail: {
    gender: Gender.Male,
    avatarURL: 'image/avatar.jpg',
    nickName: 'nick name',
  },
});

const userPostsDto = [
  plainToClass(UserPostDto, {
    id: 1,
    likesCount: 0,
    commentsCount: 1,
    thumbnail: 'image-1-thumbnail',
  }),
  plainToClass(UserPostDto, {
    id: 2,
    likesCount: 2,
    commentsCount: 1,
    thumbnail: 'image-12thumbnail',
  }),
];

export { userProfileDto, userPostsDto };
