import {
  Connection,
  createConnection,
  getRepository,
  Repository,
} from 'typeorm';

import Follow from '@infrastructure/rdb/entity/follow';
import User from '@infrastructure/rdb/entity/user';

import { FollowRepository } from '.';
import { FollowEntity } from '@domain/entity/follow';

import { users, follows } from './testData';
import { plainToClass } from '@nestjs/class-transformer';

describe('Follow Repository Testing', () => {
  const followRepository = new FollowRepository();

  let rdbConnection: Connection;
  let followRDBRepository: Repository<Follow>;
  let userRDBRepository: Repository<User>;

  let result: FollowEntity | null;
  let followRDBEntity: Follow;
  let followId: number;

  beforeAll(async () => {
    rdbConnection = await createConnection();
    followRDBRepository = getRepository(Follow);
    userRDBRepository = getRepository(User);

    await followRDBRepository.delete({});
    await userRDBRepository.delete({});

    await userRDBRepository.insert(users);
    await followRDBRepository.insert(follows);
  });
  afterAll(async () => {
    await followRDBRepository.delete({});
    await userRDBRepository.delete({});

    await rdbConnection.close();
  });

  describe('getById testing', () => {
    describe('Normal case', () => {
      describe('Can get follow with exist id', () => {
        beforeAll(async () => {
          followId = 1;

          result = await followRepository.getById(null, followId);
        });

        it('Follow data is as expected', () => {
          expect(result).toEqual(
            plainToClass(FollowEntity, {
              id: 1,
              sourceUserId: 1,
              destinationUserId: 2,
            }),
          );
        });
      });
    });

    describe('Abnormal case', () => {
      describe('Can not get anything with not exist follow id', () => {
        beforeAll(async () => {
          followId = 100;

          result = await followRepository.getById(null, followId);
        });

        it('null is returned', () => {
          expect(result).toBeNull();
        });
      });
    });
  });

  describe('getByUserIds testing', () => {
    describe('Normal case', () => {
      describe('Can get follow between two users whose have relationship', () => {
        beforeAll(async () => {
          result = await followRepository.getByUserIds(null, 1, 2);
        });

        it('Follow data is as expected', () => {
          expect(result).toEqual(
            plainToClass(FollowEntity, {
              id: 1,
              sourceUserId: 1,
              destinationUserId: 2,
            }),
          );
        });
      });
    });

    describe('Abnormal case', () => {
      describe('Can not get follow between two users whose do not have any relationships', () => {
        beforeAll(async () => {
          result = await followRepository.getByUserIds(null, 2, 3);
        });

        it('null is returned', () => {
          expect(result).toBeNull();
        });
      });
    });
  });

  describe('save testing', () => {
    describe('Normal case', () => {
      beforeAll(async () => {
        result = await followRepository.save(
          null,
          plainToClass(FollowEntity, {
            sourceUserId: 2,
            destinationUserId: 3,
          }),
        );

        followRDBEntity = await followRDBRepository.findOne({
          sourceUserId: 2,
          destinationUserId: 3,
        });
      });

      it('Follow record is saved into database', () => {
        expect(followRDBEntity).toEqual({
          id: expect.any(Number),
          sourceUserId: 2,
          destinationUserId: 3,
          createdAt: expect.any(Date),
          updatedAt: expect.any(Date),
        });
      });

      it('FollowEntity is returned', () => {
        expect(result).toEqual({
          id: expect.any(Number),
          sourceUserId: 2,
          destinationUserId: 3,
        });
        expect(result).toBeInstanceOf(FollowEntity);
      });
    });
  });

  describe('deleteById testing', () => {
    describe('Normal case', () => {
      beforeAll(async () => {
        followId = 1;

        await followRepository.deleteById(null, followId);

        followRDBEntity = await followRDBRepository.findOne({ id: followId });
      });

      it('Follow record is deleted from database', () => {
        expect(followRDBEntity).toBe(undefined);
      });
    });
  });
});
