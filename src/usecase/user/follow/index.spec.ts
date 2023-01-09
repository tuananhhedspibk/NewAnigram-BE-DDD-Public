import { plainToClass } from '@nestjs/class-transformer';
import { Connection, createConnection } from 'typeorm';

import { UserEntity } from '@domain/entity/user';
import { UserDetailGender } from '@domain/entity/user/user-detail';

import { UsecaseErrorCode, UsecaseErrorDetailCode } from '@usecase/exception';

import { FollowRepository } from '@infrastructure/repository/follow';
import TransactionManager from '@infrastructure/repository/transaction';
import { UserRepository } from '@infrastructure/repository/user';

import FollowUserUsecase, {
  FollowUserUsecaseInput,
  FollowUserUsecaseOutput,
} from '.';

describe('FollowUser Usecase testing', () => {
  let input: FollowUserUsecaseInput;
  let output: FollowUserUsecaseOutput;
  let usecase: FollowUserUsecase;
  let connection: Connection;

  const sourceUserId = 1;

  beforeAll(async () => {
    usecase = new FollowUserUsecase(
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

    describe('Can not follow myself', () => {
      beforeAll(async () => {
        input = {
          destinationUserId: 1,
        };

        try {
          await usecase.execute(input, sourceUserId);
        } catch (err) {
          error = err;
        }
      });

      it('Error code is BAD_REQUEST', () => {
        expect(error.code).toEqual(UsecaseErrorCode.BAD_REQUEST);
      });

      it('Error message is "You can not follow yourself"', () => {
        expect(error.message).toEqual('You can not follow yourself');
      });

      it('Error info detailCode is CAN_NOT_FOLLOW_MYSELF', () => {
        expect(error.info.detailCode).toEqual(
          UsecaseErrorDetailCode.CAN_NOT_FOLLOW_MYSELF,
        );
      });
    });

    describe('Source user does not exist', () => {
      beforeAll(async () => {
        input = {
          destinationUserId: 2,
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

      it('Error info includes source user id', () => {
        expect(error.info.userId).toEqual(sourceUserId);
      });
    });

    describe('Destination user does not exist', () => {
      const destinationUserId = 2;

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

      it('Error info includes destination user id', () => {
        expect(error.info.userId).toEqual(destinationUserId);
      });
    });

    // describe('Have been following user', () => {});
  });

  // describe('Normal case', () => {
  //   describe('Can follow another user', () => {});
  // });
});
