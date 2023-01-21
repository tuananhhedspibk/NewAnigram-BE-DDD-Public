import {
  Connection,
  createConnection,
  getRepository,
  Repository,
} from 'typeorm';

import User from '@infrastructure/rdb/entity/user';
import UserDetail, { Gender } from '@infrastructure/rdb/entity/user-detail';
import Post from '@infrastructure/rdb/entity/post';
import Follow from '@infrastructure/rdb/entity/follow';
import Comment from '@infrastructure/rdb/entity/comment';
import Like from '@infrastructure/rdb/entity/like';

import { UserProfileDto } from '@view/dto/user-profile-dto';

import UserViewRepository from '.';

import {
  users,
  userDetails,
  follows,
  posts,
  likes,
  comments,
} from './testData';

describe('User View Repository testing', () => {
  const userViewRepository = new UserViewRepository();

  let result;

  let rdbConnection: Connection;
  let userRDBRepository: Repository<User>;
  let userDetailRDBRepository: Repository<UserDetail>;
  let postRDBRepository: Repository<Post>;
  let commentRDBRepository: Repository<Comment>;
  let likeRDBRepository: Repository<Like>;
  let followRDBRepository: Repository<Follow>;

  beforeAll(async () => {
    rdbConnection = await createConnection();
    userRDBRepository = getRepository(User);
    userDetailRDBRepository = getRepository(UserDetail);
    postRDBRepository = getRepository(Post);
    commentRDBRepository = getRepository(Comment);
    likeRDBRepository = getRepository(Like);
    followRDBRepository = getRepository(Follow);

    await commentRDBRepository.delete({});
    await likeRDBRepository.delete({});
    await postRDBRepository.delete({});
    await followRDBRepository.delete({});
    await userDetailRDBRepository.delete({});
    await userRDBRepository.delete({});

    await userRDBRepository.insert(users);
    await userDetailRDBRepository.insert(userDetails);
    await followRDBRepository.insert(follows);
    await postRDBRepository.insert(posts);
    await commentRDBRepository.insert(comments);
    await likeRDBRepository.insert(likes);
  });

  afterAll(async () => {
    await commentRDBRepository.delete({});
    await likeRDBRepository.delete({});
    await postRDBRepository.delete({});
    await followRDBRepository.delete({});
    await userDetailRDBRepository.delete({});
    await userRDBRepository.delete({});

    await rdbConnection.close();
  });

  describe('getUserProfileById testing', () => {
    describe('Pass an existing user id', () => {
      beforeAll(async () => {
        result = await userViewRepository.getUserProfileById(1);
      });

      it('Can get user profile', () => {
        const expectResult: UserProfileDto = {
          email: 'user-1@mail.com',
          userName: 'User 1 user name',
          detail: {
            nickName: 'User 1 nick name',
            gender: Gender.Male,
            avatarURL: 'images/avatar.jpg',
          },
        };

        expect(result).toEqual(expectResult);
      });
    });

    describe('Pass a not existing user id', () => {
      beforeAll(async () => {
        result = await userViewRepository.getUserProfileById(100);
      });

      it('Return null', () => {
        expect(result).toEqual(null);
      });
    });
  });

  describe('getUserFeed testing', () => {
    let userId: number;
    let resultOfFirstPage;
    let resultOfSecondPage;

    beforeAll(async () => {
      userId = 1;

      resultOfFirstPage = await userViewRepository.getUserFeed(userId, {
        limit: 4,
        page: 1,
      });

      resultOfSecondPage = await userViewRepository.getUserFeed(userId, {
        limit: 4,
        page: 2,
      });
    });

    it('Result of first page is as expected', () => {
      expect(resultOfFirstPage).toEqual([
        {
          id: 3,
          createdAt: new Date('2023-01-04 20:00:00'),
          content: 'Post 3 content',
          tags: ['post3-tag1', 'post3-tag2'],
          images: ['post3-img1-url', 'post3-img2-url'],
          likes: [],
          comments: [
            {
              id: 3,
              content: 'Comment-3',
              createdAt: new Date('2023-01-19 12:00:00'),
              user: {
                id: 2,
                userName: 'User 2 user name',
                avatarURL: 'images/avatar2.jpg',
              },
            },
          ],
          user: {
            id: 1,
            userName: 'User 1 user name',
            avatarURL: 'images/avatar.jpg',
          },
        },
        {
          id: 6,
          createdAt: new Date('2023-01-04 16:00:00'),
          content: 'Post 6 content',
          tags: ['post6-tag1', 'post6-tag2'],
          images: ['post6-img1-url', 'post6-img2-url'],
          likes: [],
          comments: [],
          user: {
            id: 2,
            userName: 'User 2 user name',
            avatarURL: 'images/avatar2.jpg',
          },
        },
        {
          id: 1,
          createdAt: new Date('2023-01-04 12:00:00'),
          content: 'Post 1 content',
          tags: ['post1-tag1', 'post1-tag2'],
          images: ['post1-img1-url', 'post1-img2-url'],
          likes: [
            {
              id: 1,
            },
            {
              id: 2,
            },
          ],
          comments: [
            {
              id: 1,
              content: 'Comment-1',
              createdAt: new Date('2023-01-19 10:00:00'),
              user: {
                id: 1,
                userName: 'User 1 user name',
                avatarURL: 'images/avatar.jpg',
              },
            },
          ],
          user: {
            id: 1,
            userName: 'User 1 user name',
            avatarURL: 'images/avatar.jpg',
          },
        },
        {
          id: 2,
          createdAt: new Date('2023-01-04 09:00:00'),
          content: 'Post 2 content',
          tags: ['post2-tag1', 'post2-tag2'],
          images: ['post2-img1-url', 'post2-img2-url'],
          user: {
            id: 1,
            userName: 'User 1 user name',
            avatarURL: 'images/avatar.jpg',
          },
          likes: [],
          comments: [
            {
              id: 2,
              content: 'Comment-2',
              createdAt: new Date('2023-01-19 08:00:00'),
              user: {
                id: 1,
                userName: 'User 1 user name',
                avatarURL: 'images/avatar.jpg',
              },
            },
          ],
        },
      ]);
    });

    it('Result of second page is as expected', () => {
      expect(resultOfSecondPage).toEqual([
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
      ]);
    });
  });
});
