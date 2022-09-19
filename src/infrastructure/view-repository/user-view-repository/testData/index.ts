import { Gender } from '@infrastructure/rdb/entity/user-detail';

const users = [
  {
    id: 1,
    email: 'user-1@mail.com',
    password: 'password',
    salt: '10',
    userName: 'User 1 user name',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

const userDetails = [
  {
    id: 1,
    userId: 1,
    gender: Gender.Male,
    nickName: 'User 1 nick name',
    avatarURL: 'images/avatar.jpg',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

export { users, userDetails };
