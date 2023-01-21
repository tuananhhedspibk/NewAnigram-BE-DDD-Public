import {
  Connection,
  createConnection,
  getRepository,
  Repository,
} from 'typeorm';

import PostViewRepository from '.';

import Like from '@infrastructure/rdb/entity/like';
import Post from '@infrastructure/rdb/entity/post';
import User from '@infrastructure/rdb/entity/user';
import Comment from '@infrastructure/rdb/entity/comment';

import { users, posts, comments, likes } from './testData';
import { PostDetailDto } from '@view/dto/post-detail-dto';

describe('Post View Repository testing', () => {
  const postViewRepository = new PostViewRepository();

  let result;

  let rdbConnection: Connection;
  let userRDBRepository: Repository<User>;
  let postRDBRepository: Repository<Post>;
  let commentRDBRepository: Repository<Comment>;
  let likeRDBRepository: Repository<Like>;

  beforeAll(async () => {
    rdbConnection = await createConnection();
    userRDBRepository = getRepository(User);
    postRDBRepository = getRepository(Post);
    commentRDBRepository = getRepository(Comment);
    likeRDBRepository = getRepository(Like);

    await likeRDBRepository.delete({});
    await commentRDBRepository.delete({});
    await postRDBRepository.delete({});
    await userRDBRepository.delete({});

    await userRDBRepository.insert(users);
    await postRDBRepository.insert(posts);
    await commentRDBRepository.insert(comments);
    await likeRDBRepository.insert(likes);
  });
  afterAll(async () => {
    await likeRDBRepository.delete({});
    await commentRDBRepository.delete({});
    await postRDBRepository.delete({});
    await userRDBRepository.delete({});

    await rdbConnection.close();
  });

  describe('getPostDetail testing', () => {
    let postId;

    describe('Pass an existing post id', () => {
      beforeAll(async () => {
        postId = 1;

        result = await postViewRepository.getPostDetail(postId);
      });

      it('Can get post detail', () => {
        const expectData: PostDetailDto = {
          id: 1,
          content: 'Post 1 content',
          tags: ['post1-tag1', 'post1-tag2'],
          images: ['post1-img1-url', 'post1-img2-url'],
          user: {
            id: 1,
            userName: 'user1',
          },
          likes: [
            {
              id: 1,
              user: {
                id: 1,
                userName: 'user1',
              },
            },
            {
              id: 2,
              user: {
                id: 2,
                userName: 'user2',
              },
            },
          ],
          comments: [
            {
              id: 1,
              content: 'Comment-1',
              createdAt: new Date('2023-01-19 00:00:00'),
              user: {
                id: 1,
                userName: 'user1',
              },
            },
          ],
          createdAt: new Date('2023-01-04 00:00:00'),
        };

        expect(result).toEqual(expectData);
      });
    });

    describe('Pass a non existing post id', () => {
      beforeAll(async () => {
        postId = 100;

        result = await postViewRepository.getPostDetail(postId);
      });

      it('null will be returned', () => {
        expect(result).toBeNull();
      });
    });
  });

  describe('getUserPosts testing', () => {
    let userId;

    describe('User does not have any posts', () => {
      beforeAll(async () => {
        userId = 3;

        result = await postViewRepository.getUserPosts(userId);
      });

      it('Empty array is returned', () => {
        expect(result).toEqual([]);
      });
    });

    describe('User has only one post', () => {
      beforeAll(async () => {
        userId = 2;

        result = await postViewRepository.getUserPosts(userId);
      });

      it('UserPostDto array that has only one item will be returned', () => {
        expect(result).toEqual([
          {
            id: 5,
            likesCount: 1,
            commentsCount: 2,
            thumbnail: 'post5-img1-url',
          },
        ]);
      });
    });

    describe('User has more than one post', () => {
      beforeAll(async () => {
        userId = 1;

        result = await postViewRepository.getUserPosts(userId);
      });

      it('UserPostsDto array is returned', () => {
        expect(result).toEqual([
          {
            id: 1,
            likesCount: 2,
            commentsCount: 1,
            thumbnail: 'post1-img1-url',
          },
          {
            id: 2,
            likesCount: 0,
            commentsCount: 1,
            thumbnail: 'post2-img1-url',
          },
          {
            id: 3,
            likesCount: 0,
            commentsCount: 1,
            thumbnail: 'post3-img1-url',
          },
          {
            id: 4,
            likesCount: 0,
            commentsCount: 0,
            thumbnail: 'post4-img1-url',
          },
        ]);
      });
    });
  });
});
