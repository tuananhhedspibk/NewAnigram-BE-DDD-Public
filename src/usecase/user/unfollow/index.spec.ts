import { plainToClass } from '@nestjs/class-transformer';
import { Connection, createConnection } from 'typeorm';

import { UserEntity } from '@domain/entity/user';
import { UserDetailGender } from '@domain/entity/user/user-detail';
import { FollowEntity } from '@domain/entity/follow';

import { FollowRepository } from '@infrastructure/repository/follow';
import TransactionManager from '@infrastructure/repository/transaction';
import { UserRepository } from '@infrastructure/repository/user';

import { UsecaseErrorCode, UsecaseErrorDetailCode } from '@usecase/exception';

import UnfollowUserUsecase, {
  UnfollowUserUsecaseInput,
  UnfollowUserUsecaseOutput,
} from '.';

import { ApiResultCode } from '@usecase/dto/api-result';

describe('UnfollowUser Usecase Testing', () => {
  let input: UnfollowUserUsecaseInput;
  let output: UnfollowUserUsecaseOutput;
  let usecase: UnfollowUserUsecase;
  let connection: Connection;

  const destinationUserId = 2;

  const sourceUserId = 1;

  beforeAll(async () => {
    usecase = new UnfollowUserUsecase(
      new UserRepository(),
      new FollowRepository(),
      new TransactionManager(),
    );
    connection = await createConnection();
  });
  afterAll(async () => {
    await connection.close();
  });

  describe('Abnormal case', () => {
    let error;

    describe('Source user does not exist error', () => {
      beforeAll(async () => {
        input = {
          destinationUserId,
        };

        jest
          .spyOn(UserRepository.prototype, 'getByIds')
          .mockResolvedValue([null, null]);

        try {
          await usecase.execute(input, sourceUserId);
        } catch (err) {
          error = err;
        }
      });

      it('Error code is NOT_FOUND', () => {
        expect(error.code).toEqual(UsecaseErrorCode.NOT_FOUND);
      });

      it('Error message is "Source user does not exist"', () => {
        expect(error.message).toEqual('Source user does not exist');
      });

      it('Error info detailCode is SOURCE_USER_NOT_EXIST', () => {
        expect(error.info.detailCode).toEqual(
          UsecaseErrorDetailCode.SOURCE_USER_NOT_EXIST,
        );
      });
    });

    describe('Destination user does not exist error', () => {
      beforeAll(async () => {
        input = {
          destinationUserId,
        };

        jest.spyOn(UserRepository.prototype, 'getByIds').mockResolvedValue([
          plainToClass(UserEntity, {
            id: 1,
            email: 'test-haha@mail.com',
            userName: 'userName',
            detail: {
              id: 1,
              nickName: 'nickName',
              avatarURL: 'avatarURL',
              gender: UserDetailGender.Male,
              active: true,
            },
          }),
          null,
        ]);

        try {
          await usecase.execute(input, sourceUserId);
        } catch (err) {
          error = err;
        }
      });

      it('Error code is NOT_FOUND', () => {
        expect(error.code).toEqual(UsecaseErrorCode.NOT_FOUND);
      });

      it('Error message is "Destination user does not exist"', () => {
        expect(error.message).toEqual('Destination user does not exist');
      });

      it('Error info detailCode is DESTINATION_USER_NOT_EXIST', () => {
        expect(error.info.detailCode).toEqual(
          UsecaseErrorDetailCode.DESTINATION_USER_NOT_EXIST,
        );
      });
    });

    describe('You are not following this user', () => {
      beforeAll(async () => {
        input = {
          destinationUserId,
        };

        jest.spyOn(UserRepository.prototype, 'getByIds').mockResolvedValue([
          plainToClass(UserEntity, {
            id: 1,
            email: 'user1@mail.com',
            userName: 'userName1',
            detail: {
              id: 1,
              nickName: 'nickName1',
              avatarURL: 'avatarURL',
              gender: UserDetailGender.Male,
              active: true,
            },
          }),
          plainToClass(UserEntity, {
            id: 2,
            email: 'user2@mail.com',
            userName: 'userName2',
            detail: {
              id: 2,
              nickName: 'nickName2',
              avatarURL: 'avatarURL',
              gender: UserDetailGender.Male,
              active: true,
            },
          }),
        ]);

        jest
          .spyOn(FollowRepository.prototype, 'getByUserIds')
          .mockResolvedValue(null);

        try {
          await usecase.execute(input, sourceUserId);
        } catch (err) {
          error = err;
        }
      });

      it('Error code is BAD_REQUEST', () => {
        expect(error.code).toEqual(UsecaseErrorCode.BAD_REQUEST);
      });

      it('Error message is "You are not following this user"', () => {
        expect(error.message).toEqual('You are not following this user');
      });

      it('Error info detailCode is NOT_FOLLOWING_USER', () => {
        expect(error.info.detailCode).toEqual(
          UsecaseErrorDetailCode.NOT_FOLLOWING_USER,
        );
      });
    });
  });

  describe('Normal case', () => {
    beforeAll(async () => {
      input = {
        destinationUserId,
      };

      jest.spyOn(UserRepository.prototype, 'getByIds').mockResolvedValue([
        plainToClass(UserEntity, {
          id: 1,
          email: 'user1@mail.com',
          userName: 'userName1',
          detail: {
            id: 1,
            nickName: 'nickName1',
            avatarURL: 'avatarURL',
            gender: UserDetailGender.Male,
            active: true,
          },
        }),
        plainToClass(UserEntity, {
          id: 2,
          email: 'user2@mail.com',
          userName: 'userName2',
          detail: {
            id: 2,
            nickName: 'nickName2',
            avatarURL: 'avatarURL',
            gender: UserDetailGender.Male,
            active: true,
          },
        }),
      ]);

      jest.spyOn(FollowRepository.prototype, 'getByUserIds').mockResolvedValue(
        plainToClass(FollowEntity, {
          id: 1,
          sourceUserId: 1,
          destinationUserId: 2,
        }),
      );

      jest
        .spyOn(FollowRepository.prototype, 'deleteById')
        .mockResolvedValue(null);

      output = await usecase.execute(input, sourceUserId);
    });

    it('Response code is OK', () => {
      expect(output.result.code).toEqual(ApiResultCode.OK);
    });
  });
});
