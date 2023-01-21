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
  {
    id: 2,
    email: 'user-2@mail.com',
    password: 'password',
    salt: '20',
    userName: 'User 2 user name',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 3,
    email: 'user-3@mail.com',
    password: 'password',
    salt: '30',
    userName: 'User 3 user name',
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
  {
    id: 2,
    userId: 2,
    gender: Gender.Male,
    nickName: 'User 2 nick name',
    avatarURL: 'images/avatar2.jpg',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 3,
    userId: 3,
    gender: Gender.Male,
    nickName: 'User 3 nick name',
    avatarURL: 'images/avatar3.jpg',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

const posts = [
  {
    id: 1,
    content: 'Post 1 content',
    tags: { list: ['post1-tag1', 'post1-tag2'] },
    images: { list: ['post1-img1-url', 'post1-img2-url'] },
    createdAt: new Date('2023-01-04 12:00:00'),
    updatedAt: new Date('2023-01-04 12:00:00'),
    userId: 1,
  },
  {
    id: 2,
    content: 'Post 2 content',
    tags: { list: ['post2-tag1', 'post2-tag2'] },
    images: { list: ['post2-img1-url', 'post2-img2-url'] },
    createdAt: new Date('2023-01-04 09:00:00'),
    updatedAt: new Date('2023-01-04 09:00:00'),
    userId: 1,
  },
  {
    id: 3,
    content: 'Post 3 content',
    tags: { list: ['post3-tag1', 'post3-tag2'] },
    images: { list: ['post3-img1-url', 'post3-img2-url'] },
    createdAt: new Date('2023-01-04 20:00:00'),
    updatedAt: new Date('2023-01-04 20:00:00'),
    userId: 1,
  },
  {
    id: 4,
    content: 'Post 4 content',
    tags: { list: ['post4-tag1', 'post4-tag2'] },
    images: { list: ['post4-img1-url', 'post4-img2-url'] },
    createdAt: new Date('2023-01-04 05:00:00'),
    updatedAt: new Date('2023-01-04 05:00:00'),
    userId: 1,
  },
  {
    id: 5,
    content: 'Post 5 content',
    tags: { list: ['post5-tag1', 'post5-tag2'] },
    images: { list: ['post5-img1-url', 'post5-img2-url'] },
    createdAt: new Date('2023-01-04 08:00:00'),
    updatedAt: new Date('2023-01-04 08:00:00'),
    userId: 2,
  },
  {
    id: 6,
    content: 'Post 6 content',
    tags: { list: ['post6-tag1', 'post6-tag2'] },
    images: { list: ['post6-img1-url', 'post6-img2-url'] },
    createdAt: new Date('2023-01-04 16:00:00'),
    updatedAt: new Date('2023-01-04 16:00:00'),
    userId: 2,
  },
  {
    id: 7,
    content: 'Post 7 content',
    tags: { list: ['post7-tag1', 'post7-tag2'] },
    images: { list: ['post7-img1-url', 'post7-img2-url'] },
    createdAt: new Date('2023-01-04 07:00:00'),
    updatedAt: new Date('2023-01-04 07:00:00'),
    userId: 3,
  },
];

const comments = [
  {
    id: 1,
    userId: 1,
    postId: 1,
    content: 'Comment-1',
    createdAt: new Date('2023-01-19 10:00:00'),
    updatedAt: new Date('2023-01-19 10:00:00'),
  },
  {
    id: 2,
    userId: 1,
    postId: 2,
    content: 'Comment-2',
    createdAt: new Date('2023-01-19 08:00:00'),
    updatedAt: new Date('2023-01-19 08:00:00'),
  },
  {
    id: 3,
    userId: 2,
    postId: 3,
    content: 'Comment-3',
    createdAt: new Date('2023-01-19 12:00:00'),
    updatedAt: new Date('2023-01-19 12:00:00'),
  },
  {
    id: 4,
    userId: 2,
    postId: 5,
    content: 'Comment-4',
    createdAt: new Date('2023-01-19 03:00:00'),
    updatedAt: new Date('2023-01-19 03:00:00'),
  },
  {
    id: 5,
    userId: 3,
    postId: 5,
    content: 'Comment-5',
    createdAt: new Date('2023-01-19 21:00:00'),
    updatedAt: new Date('2023-01-19 21:00:00'),
  },
];

const likes = [
  {
    id: 1,
    userId: 1,
    postId: 1,
    createdAt: new Date('2023-01-19 00:00:00'),
    updatedAt: new Date('2023-01-19 00:00:00'),
  },
  {
    id: 2,
    userId: 2,
    postId: 1,
    createdAt: new Date('2023-01-19 00:00:00'),
    updatedAt: new Date('2023-01-19 00:00:00'),
  },
  {
    id: 3,
    userId: 2,
    postId: 5,
    createdAt: new Date('2023-01-19 00:00:00'),
    updatedAt: new Date('2023-01-19 00:00:00'),
  },
];

const follows = [
  {
    id: 1,
    sourceUserId: 1,
    destinationUserId: 2,
  },
  {
    id: 2,
    sourceUserId: 2,
    destinationUserId: 1,
  },
];

export { users, userDetails, posts, comments, likes, follows };
