import { plainToClass } from '@nestjs/class-transformer';
import { Connection, createConnection } from 'typeorm';

import { DomainErrorCode, DomainErrorDetailCode } from '@domain/exception';
import { UserEntity } from '@domain/entity/user';
import { UserDetailGender } from '@domain/entity/user/user-detail';
import { AuthenticateRepository } from '@infrastructure/repository/authenticate';
import TransactionManager from '@infrastructure/repository/transaction';
import { UserRepository } from '@infrastructure/repository/user';

import { UsecaseErrorCode, UsecaseErrorDetailCode } from '@usecase/exception';
import UpdatePasswordUsecase, {
  UpdatePasswordUsecaseInput,
  UpdatePasswordUsecaseOutput,
} from '.';
import { ApiResultCode } from '@usecase/dto/api-result';

describe('UpdatePassword Usecase testing', () => {
  let input: UpdatePasswordUsecaseInput;
  let output: UpdatePasswordUsecaseOutput;
  let usecase: UpdatePasswordUsecase;
  let connection: Connection;

  beforeAll(async () => {
    usecase = new UpdatePasswordUsecase(
      new AuthenticateRepository(),
      new UserRepository(),
      new TransactionManager(),
    );

    connection = await createConnection();
  });
  afterAll(async () => {
    connection.close();
  });

  describe('Abnormal case', () => {
    let error;

    describe('User does not exist', () => {
      beforeAll(async () => {
        input = {
          newPassword: 'newPass',
          currentPassword: 'currentPass',
        };

        jest.spyOn(UserRepository.prototype, 'getById').mockResolvedValue(null);
        try {
          await usecase.execute(input, 1);
        } catch (e) {
          error = e;
        }
      });

      it('Error code is NOT_FOUND', () => {
        expect(error.code).toEqual(UsecaseErrorCode.NOT_FOUND);
      });

      it('Error message is "User does not exist"', () => {
        expect(error.message).toEqual('User does not exist');
      });

      it('Error info errorCode is USER_NOT_EXIST', () => {
        expect(error.info.detailCode).toEqual(
          UsecaseErrorDetailCode.USER_NOT_EXIST,
        );
      });

      it('Error info userId is 1', () => {
        expect(error.info.userId).toEqual(1);
      });
    });

    describe('Current password does not match', () => {
      beforeAll(async () => {
        input = {
          currentPassword: 'notmatchpass',
          newPassword: 'newpass',
        };

        jest.spyOn(UserRepository.prototype, 'getById').mockResolvedValue(
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
        );

        jest
          .spyOn(AuthenticateRepository.prototype, 'validatePassword')
          .mockResolvedValue(false);

        try {
          await usecase.execute(input, 1);
        } catch (err) {
          error = err;
        }
      });

      it('Error code is BAD_REQUEST', () => {
        expect(error.code).toEqual(UsecaseErrorCode.BAD_REQUEST);
      });

      it('Error message is "Current password does not match"', () => {
        expect(error.message).toEqual('Current password does not match');
      });

      it('Error info errorCode is CURRENT_PASS_NOT_MATCH', () => {
        expect(error.info.detailCode).toEqual(
          UsecaseErrorDetailCode.CURRENT_PASS_NOT_MATCH,
        );
      });
    });

    describe('Password must contain at least eight characters, at least one number and both lower and uppercase letters and special characters error occurs', () => {
      beforeAll(async () => {
        input = {
          currentPassword: 'currentPass',
          newPassword: 'newpass',
        };

        jest.spyOn(UserRepository.prototype, 'getById').mockResolvedValue(
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
        );

        jest
          .spyOn(AuthenticateRepository.prototype, 'validatePassword')
          .mockResolvedValue(true);

        try {
          await usecase.execute(input, 1);
        } catch (err) {
          error = err;
        }
      });

      it('Error code is BAD_REQUEST', () => {
        expect(error.code).toEqual(DomainErrorCode.BAD_REQUEST);
      });

      it('Error message is "Password must contain at least eight characters, at least one number and both lower and uppercase letters and special characters"', () => {
        expect(error.message).toEqual(
          'Password must contain at least eight characters, at least one number and both lower and uppercase letters and special characters',
        );
      });

      it('Error info errorCode is CURRENT_PASS_NOT_MATCH', () => {
        expect(error.info.detailCode).toEqual(
          DomainErrorDetailCode.INVALID_PASSWORD_FORMAT,
        );
      });
    });
  });

  describe('Normal case', () => {
    beforeAll(async () => {
      input = {
        currentPassword: 'currentPassword',
        newPassword: 'TestPassword@123',
      };

      jest.spyOn(UserRepository.prototype, 'getById').mockResolvedValue(
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
      );
      jest
        .spyOn(AuthenticateRepository.prototype, 'validatePassword')
        .mockResolvedValue(true);

      jest.spyOn(UserRepository.prototype, 'update').mockResolvedValue(
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
      );

      output = await usecase.execute(input, 1);
    });

    it('Output result code is OK', () => {
      expect(output.result.code).toEqual(ApiResultCode.OK);
    });
  });
});
