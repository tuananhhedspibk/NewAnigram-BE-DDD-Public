import {
  Connection,
  createConnection,
  getRepository,
  Repository,
} from 'typeorm';
import { plainToClass } from '@nestjs/class-transformer';

import { CommentEntity } from '@domain/entity/post/comment';

import Post from '@infrastructure/rdb/entity/post';
import User from '@infrastructure/rdb/entity/user';
import Comment from '@infrastructure/rdb/entity/comment';

import { CommentRepository } from '.';

import { users, posts, comments } from './testData';

describe('Comment Repository Testing', () => {
  const commentRepository = new CommentRepository();

  let rdbConnection: Connection;
  let commentRDBRepository: Repository<Comment>;
  let userRDBRepository: Repository<User>;
  let postRDBRepository: Repository<Post>;

  let result: CommentEntity | null;
  let commentRDBEntity: Comment;
  let commentId: number;

  beforeAll(async () => {
    rdbConnection = await createConnection();

    userRDBRepository = getRepository(User);
    postRDBRepository = getRepository(Post);
    commentRDBRepository = getRepository(Comment);

    await commentRDBRepository.delete({});
    await postRDBRepository.delete({});
    await userRDBRepository.delete({});

    await userRDBRepository.insert(users);
    await postRDBRepository.insert(posts);
    await commentRDBRepository.insert(comments);
  });
  afterAll(async () => {
    await commentRDBRepository.delete({});
    await postRDBRepository.delete({});
    await userRDBRepository.delete({});

    await rdbConnection.close();
  });

  describe('getById testing', () => {
    describe('Normal case', () => {
      describe('Can get comment with exist id', () => {
        beforeAll(async () => {
          commentId = 1;
          result = await commentRepository.getById(null, commentId);
        });

        it('Comment data is as expected', () => {
          expect(result).toEqual(
            plainToClass(CommentEntity, {
              id: 1,
              postId: 1,
              userId: 1,
              content: 'Comment-1',
            }),
          );
        });
      });

      describe('Can not get comment with non-exist id', () => {
        beforeAll(async () => {
          commentId = 100;

          result = await commentRepository.getById(null, commentId);
        });

        it('null is returned', () => {
          expect(result).toBeNull();
        });
      });
    });
  });

  describe('save testing', () => {
    beforeAll(async () => {
      result = await commentRepository.save(
        null,
        plainToClass(CommentEntity, {
          postId: 3,
          userId: 3,
          content: 'New comment',
        }),
      );

      commentRDBEntity = await commentRDBRepository.findOne({
        where: { id: result.id },
      });
    });

    it('Result data is as expected', () => {
      expect(result).toEqual({
        id: expect.any(Number),
        postId: 3,
        userId: 3,
        content: 'New comment',
      });
    });

    it('Result data type is CommentEntity', () => {
      expect(result).toBeInstanceOf(CommentEntity);
    });

    it('Comment data is saved into database', () => {
      expect(commentRDBEntity).toEqual({
        id: expect.any(Number),
        postId: 3,
        userId: 3,
        content: 'New comment',
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      });
    });
  });

  describe('update testing', () => {
    beforeAll(async () => {
      commentId = 1;

      result = await commentRepository.update(
        null,
        plainToClass(CommentEntity, {
          id: commentId,
          postId: 1,
          userId: 1,
          content: 'New comment',
        }),
      );

      commentRDBEntity = await commentRDBRepository.findOne({
        where: { id: commentId },
      });
    });

    it('Result data is as expected', () => {
      expect(result).toEqual(
        plainToClass(CommentEntity, {
          id: commentId,
          postId: 1,
          userId: 1,
          content: 'New comment',
        }),
      );
    });

    it('Comment data in database is updated', () => {
      expect(commentRDBEntity).toEqual({
        id: commentId,
        postId: 1,
        userId: 1,
        content: 'New comment',
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      });
    });
  });

  describe('deleteById testing', () => {
    beforeAll(async () => {
      commentId = 1;

      await commentRepository.deleteById(null, commentId);

      commentRDBEntity = await commentRDBRepository.findOne(commentId);
    });

    it('Comment data is deleted from database', () => {
      expect(commentRDBEntity).toEqual(undefined);
    });
  });
});
