import { Gender } from '@infrastructure/rdb/entity/user-detail';

const users = [
  {
    id: 1,
    email: 'user-1@mail.com',
    password: 'oldpassword',
    salt: '$2b$10$/n3qTMP.twbfFKpv6tmisu',
    userName: 'user1',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 2,
    email: 'user-2@mail.com',
    password: 'password',
    salt: '$2b$10$/n3qTMP.twbfFKpv6tmisa',
    userName: 'user2',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 4,
    email: 'user-4@mail.com',
    password: 'password',
    salt: '$2b$10$/n3qTMP.twbfFKpv6tmisi',
    userName: 'user4',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

const userDetails = [
  {
    id: 1,
    userId: 1,
    nickName: 'user-1-nick-name',
    avatarURL: 'user-1-avatar.jpg',
    gender: Gender.Male,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 2,
    userId: 2,
    nickName: 'user-2-nick-name',
    avatarURL: 'user-2-avatar.jpg',
    gender: Gender.Male,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

export { users, userDetails };
