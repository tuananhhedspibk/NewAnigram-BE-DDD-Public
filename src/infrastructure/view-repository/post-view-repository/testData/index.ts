const users = [
  {
    id: 1,
    email: 'user-1@mail.com',
    password: 'oldpassword',
    salt: '$2b$10$/n3qTMP.twbfFKpv6tmisu',
    userName: 'user1',
    createdAt: new Date('2023-01-04 00:00:00'),
    updatedAt: new Date('2023-01-04 00:00:00'),
  },
  {
    id: 2,
    email: 'user-2@mail.com',
    password: 'password',
    salt: '$2b$10$/n3qTMP.twbfFKpv6tmisa',
    userName: 'user2',
    createdAt: new Date('2023-01-04 00:00:00'),
    updatedAt: new Date('2023-01-04 00:00:00'),
  },
  {
    id: 3,
    email: 'user-3@mail.com',
    password: 'password',
    salt: '$2b$10$/n3qTMP.twbfFKpv6tmisa',
    userName: 'user3',
    createdAt: new Date('2023-01-04 00:00:00'),
    updatedAt: new Date('2023-01-04 00:00:00'),
  },
];

const posts = [
  {
    id: 1,
    content: 'Post 1 content',
    tags: { list: ['post1-tag1', 'post1-tag2'] },
    images: { list: ['post1-img1-url', 'post1-img2-url'] },
    createdAt: new Date('2023-01-04 00:00:00'),
    updatedAt: new Date('2023-01-04 00:00:00'),
    userId: 1,
  },
  {
    id: 2,
    content: 'Post 2 content',
    tags: { list: ['post2-tag1', 'post2-tag2'] },
    images: { list: ['post2-img1-url', 'post2-img2-url'] },
    createdAt: new Date('2023-01-04 00:00:00'),
    updatedAt: new Date('2023-01-04 00:00:00'),
    userId: 1,
  },
  {
    id: 3,
    content: 'Post 3 content',
    tags: { list: ['post3-tag1', 'post3-tag2'] },
    images: { list: ['post3-img1-url', 'post3-img2-url'] },
    createdAt: new Date('2023-01-04 00:00:00'),
    updatedAt: new Date('2023-01-04 00:00:00'),
    userId: 1,
  },
  {
    id: 4,
    content: 'Post 4 content',
    tags: { list: ['post4-tag1', 'post4-tag2'] },
    images: { list: ['post4-img1-url', 'post4-img2-url'] },
    createdAt: new Date('2023-01-04 00:00:00'),
    updatedAt: new Date('2023-01-04 00:00:00'),
    userId: 1,
  },
  {
    id: 5,
    content: 'Post 5 content',
    tags: { list: ['post5-tag1', 'post5-tag2'] },
    images: { list: ['post5-img1-url', 'post5-img2-url'] },
    createdAt: new Date('2023-01-04 00:00:00'),
    updatedAt: new Date('2023-01-04 00:00:00'),
    userId: 2,
  },
];

const comments = [
  {
    id: 1,
    userId: 1,
    postId: 1,
    content: 'Comment-1',
    createdAt: new Date('2023-01-19 00:00:00'),
    updatedAt: new Date('2023-01-19 00:00:00'),
  },
  {
    id: 2,
    userId: 1,
    postId: 2,
    content: 'Comment-2',
    createdAt: new Date('2023-01-19 00:00:00'),
    updatedAt: new Date('2023-01-19 00:00:00'),
  },
  {
    id: 3,
    userId: 2,
    postId: 3,
    content: 'Comment-3',
    createdAt: new Date('2023-01-19 00:00:00'),
    updatedAt: new Date('2023-01-19 00:00:00'),
  },
  {
    id: 4,
    userId: 2,
    postId: 5,
    content: 'Comment-4',
    createdAt: new Date('2023-01-19 00:00:00'),
    updatedAt: new Date('2023-01-19 00:00:00'),
  },
  {
    id: 5,
    userId: 1,
    postId: 5,
    content: 'Comment-5',
    createdAt: new Date('2023-01-19 00:00:00'),
    updatedAt: new Date('2023-01-19 00:00:00'),
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

export { users, posts, comments, likes };
