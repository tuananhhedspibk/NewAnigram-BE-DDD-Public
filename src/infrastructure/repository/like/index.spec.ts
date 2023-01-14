import {
  Connection,
  createConnection,
  getRepository,
  Repository,
} from 'typeorm';

import { LikeRepository } from '.';

import { LikeEntity } from '@domain/entity/post/like';

import Like from '@infrastructure/rdb/entity/like';
import Post from '@infrastructure/rdb/entity/post';
import User from '@infrastructure/rdb/entity/user';

import { posts, users, likes } from './testData';
import { plainToClass } from '@nestjs/class-transformer';

describe('Like Repository Testing', () => {
  const likeRepository = new LikeRepository();

  let rdbConnection: Connection;
  let likeRDBRepository: Repository<Like>;
  let postRDBRepository: Repository<Post>;
  let userRDBRepository: Repository<User>;

  let postId: number;
  let userId: number;
  let likeId: number;

  let rdbLike: Like;
  let result: LikeEntity | null;

  beforeAll(async () => {
    rdbConnection = await createConnection();
    likeRDBRepository = getRepository(Like);
    postRDBRepository = getRepository(Post);
    userRDBRepository = getRepository(User);

    await likeRDBRepository.delete({});
    await postRDBRepository.delete({});
    await userRDBRepository.delete({});

    await userRDBRepository.insert(users);
    await postRDBRepository.insert(posts);
    await likeRDBRepository.insert(likes);
  });
  afterAll(async () => {
    await likeRDBRepository.delete({});
    await postRDBRepository.delete({});
    await userRDBRepository.delete({});

    await rdbConnection.close();
  });

  describe('getById testing', () => {
    describe('Normal case', () => {
      describe('Can get like that has exist id', () => {
        beforeAll(async () => {
          likeId = 1;

          result = await likeRepository.getById(null, likeId);
        });

        it('Result data is as expected', () => {
          expect(result).toEqual({
            id: 1,
            postId: 1,
            userId: 1,
          });
        });

        it('Result data type is LikeEntity', () => {
          expect(result).toBeInstanceOf(LikeEntity);
        });
      });

      describe('Can not get like that has non-exist id', () => {
        beforeAll(async () => {
          likeId = 100;

          result = await likeRepository.getById(null, likeId);
        });

        it('Result is null', () => {
          expect(result).toBeNull();
        });
      });
    });
  });

  describe('getByPostAndUserId testing', () => {
    describe('Normal case', () => {
      describe('Can get like of post', () => {
        beforeAll(async () => {
          postId = 1;
          userId = 1;

          result = await likeRepository.getByPostAndUserId(
            null,
            postId,
            userId,
          );
        });

        it('Result data is as expected', () => {
          expect(result).toEqual({
            id: 1,
            postId: 1,
            userId: 1,
          });
        });

        it('Result data type is LikeEntity', () => {
          expect(result).toBeInstanceOf(LikeEntity);
        });
      });

      describe('Can not get like of post', () => {
        beforeAll(async () => {
          postId = 4;
          userId = 1;

          result = await likeRepository.getByPostAndUserId(
            null,
            postId,
            userId,
          );
        });

        it('Result is null', () => {
          expect(result).toBeNull();
        });
      });
    });
  });

  describe('save testing', () => {
    beforeAll(async () => {
      postId = 4;
      userId = 1;

      result = await likeRepository.save(
        null,
        plainToClass(LikeEntity, {
          postId,
          userId,
        }),
      );

      rdbLike = await likeRDBRepository.findOne({ postId, userId });
    });

    it('Result data is as expected', () => {
      expect(result).toEqual({
        id: expect.any(Number),
        postId,
        userId,
      });
    });

    it('Result data type is LikeEntity', () => {
      expect(result).toBeInstanceOf(LikeEntity);
    });

    it('Data is saved to database', () => {
      expect(rdbLike).toEqual({
        id: expect.any(Number),
        postId,
        userId,
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      });
    });
  });

  describe('deleteById testing', () => {
    beforeAll(async () => {
      likeId = 1;
      await likeRepository.deleteById(null, likeId);

      rdbLike = await likeRDBRepository.findOne({ id: likeId });
    });

    it('Data is deleted from database', () => {
      expect(rdbLike).toBe(undefined);
    });
  });
});
