import { Connection, createConnection } from 'typeorm';
import { plainToClass } from '@nestjs/class-transformer';

import TransactionManager from '@infrastructure/repository/transaction';
import { UserRepository } from '@infrastructure/repository/user';
import ImageRepository from '@infrastructure/repository/image';
import UpdateUserProfileUsecase, {
  UpdateUserProfileUsecaseInput,
  UpdateUserProfileUsecaseOutput,
} from '.';
import { UsecaseErrorCode, UsecaseErrorDetailCode } from '@usecase/exception';
import { ApiResultCode } from '@usecase/dto/api-result';
import { UserEntity } from '@domain/entity/user';
import { UserDetailGender } from '@domain/entity/user/user-detail';

import * as testImage from './testData/test_image.jpeg';

describe('UpdateProfile Usecase testing', () => {
  let input: UpdateUserProfileUsecaseInput;
  let output: UpdateUserProfileUsecaseOutput;
  let usecase: UpdateUserProfileUsecase;
  let connection: Connection;

  beforeAll(async () => {
    usecase = new UpdateUserProfileUsecase(
      new UserRepository(),
      new ImageRepository(),
      new TransactionManager(),
    );
    connection = await createConnection();
  });
  afterAll(async () => {
    await connection.close();
  });

  describe('Abnormal case', () => {
    let error;

    describe('User does not exist', () => {
      beforeAll(async () => {
        input = {
          email: 'test@mail.com',
        };

        jest.spyOn(UserRepository.prototype, 'getById').mockResolvedValue(null);
        try {
          await usecase.execute(input, 1);
        } catch (err) {
          error = err;
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
  });

  describe('Normal case', () => {
    describe('Can update user and user detail data', () => {
      beforeAll(async () => {
        input = {
          email: 'test@mail.com',
          avatar: testImage,
          nickName: 'testNickName',
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
          .spyOn(ImageRepository.prototype, 'generateKey')
          .mockReturnValue('imageKey');

        jest
          .spyOn(ImageRepository.prototype, 'generateGetURL')
          .mockReturnValue('getURL');

        jest
          .spyOn(ImageRepository.prototype, 'uploadImageToImageServer')
          .mockResolvedValue(null);

        jest.spyOn(UserRepository.prototype, 'update').mockResolvedValue(null);

        output = await usecase.execute(input, 1);
      });

      it('Output API result is OK', () => {
        expect(output.result.code).toEqual(ApiResultCode.OK);
      });
    });
  });
});
