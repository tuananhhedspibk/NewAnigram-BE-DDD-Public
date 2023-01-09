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

const follows = [
  {
    id: 1,
    sourceUserId: 1,
    destinationUserId: 2,
  },
  {
    id: 2,
    sourceUserId: 1,
    destinationUserId: 3,
  },
  {
    id: 3,
    sourceUserId: 3,
    destinationUserId: 1,
  },
];

export { users, follows };
