import { plainToClass } from '@nestjs/class-transformer';

import { Gender } from '@infrastructure/rdb/entity/user-detail';
import { UserProfileDto } from '@view/dto/user-profile-dto';

const userProfileDto = plainToClass(UserProfileDto, {
  email: 'test@mail.com',
  userName: 'userName',
  detail: {
    gender: Gender.Male,
    avatarURL: 'image/avatar.jpg',
    nickName: 'nick name',
  },
});

const userFeedPosts = [
  {
    id: 5,
    createdAt: new Date('2023-01-04 08:00:00'),
    content: 'Post 5 content',
    tags: ['post5-tag1', 'post5-tag2'],
    images: ['post5-img1-url', 'post5-img2-url'],
    user: {
      id: 2,
      userName: 'User 2 user name',
      avatarURL: 'images/avatar2.jpg',
    },
    likes: [
      {
        id: 3,
      },
    ],
    comments: [
      {
        id: 4,
        content: 'Comment-4',
        createdAt: new Date('2023-01-19 03:00:00'),
        user: {
          id: 2,
          userName: 'User 2 user name',
          avatarURL: 'images/avatar2.jpg',
        },
      },
      {
        id: 5,
        content: 'Comment-5',
        createdAt: new Date('2023-01-19 21:00:00'),
        user: {
          id: 3,
          userName: 'User 3 user name',
          avatarURL: 'images/avatar3.jpg',
        },
      },
    ],
  },
  {
    id: 4,
    createdAt: new Date('2023-01-04 05:00:00'),
    content: 'Post 4 content',
    tags: ['post4-tag1', 'post4-tag2'],
    images: ['post4-img1-url', 'post4-img2-url'],
    likes: [],
    comments: [],
    user: {
      id: 1,
      userName: 'User 1 user name',
      avatarURL: 'images/avatar.jpg',
    },
  },
];

export { userFeedPosts, userProfileDto };
