import { plainToClass } from '@nestjs/class-transformer';
import { Connection, createConnection } from 'typeorm';

import { PostEntity } from '@domain/entity/post';
import { UserEntity } from '@domain/entity/user';

import { PostRepository } from '@infrastructure/repository/post';
import TransactionManager from '@infrastructure/repository/transaction';
import { UserRepository } from '@infrastructure/repository/user';

import { ApiResultCode } from '@usecase/dto/api-result';
import { UsecaseErrorCode, UsecaseErrorDetailCode } from '@usecase/exception';

import DeletePostUsecase, {
  DeletePostUsecaseInput,
  DeletePostUsecaseOutput,
} from '.';

describe('DeletePost Usecase Testing', () => {
  let input: DeletePostUsecaseInput;
  let output: DeletePostUsecaseOutput;
  let usecase: DeletePostUsecase;
  let connection: Connection;

  const userId = 1;

  beforeAll(async () => {
    usecase = new DeletePostUsecase(
      new UserRepository(),
      new PostRepository(),
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
          id: 1,
        };

        jest.spyOn(UserRepository.prototype, 'getById').mockResolvedValue(null);

        try {
          await usecase.execute(input, userId);
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

      it('Error info detail code is USER_NOT_EXIST', () => {
        expect(error.info.detailCode).toEqual(
          UsecaseErrorDetailCode.USER_NOT_EXIST,
        );
      });

      it('Error info includes userId', () => {
        expect(error.info.userId).toEqual(userId);
      });
    });

    describe('Post does not exist', () => {
      beforeAll(async () => {
        input = {
          id: 1,
        };

        jest.spyOn(UserRepository.prototype, 'getById').mockResolvedValue(
          plainToClass(UserEntity, {
            id: 1,
            email: 'test@mail.com',
            userName: 'userName',
            detail: null,
          }),
        );

        jest.spyOn(PostRepository.prototype, 'getById').mockResolvedValue(null);

        try {
          await usecase.execute(input, userId);
        } catch (err) {
          error = err;
        }
      });

      it('Error code is NOT_FOUND', () => {
        expect(error.code).toEqual(UsecaseErrorCode.NOT_FOUND);
      });

      it('Error message is Post does not exist', () => {
        expect(error.message).toEqual('Post does not exist');
      });

      it('Error info detail code is POST_NOT_EXIST', () => {
        expect(error.info.detailCode).toEqual(
          UsecaseErrorDetailCode.POST_NOT_EXIST,
        );
      });

      it('Error info includes post id', () => {
        expect(error.info.postId).toEqual(input.id);
      });
    });

    describe('User unauthorized to delete post', () => {
      beforeAll(async () => {
        input = {
          id: 1,
        };

        jest.spyOn(UserRepository.prototype, 'getById').mockResolvedValue(
          plainToClass(UserEntity, {
            id: 1,
            email: 'test@mail.com',
            userName: 'userName',
            detail: null,
          }),
        );

        jest.spyOn(PostRepository.prototype, 'getById').mockResolvedValue(
          plainToClass(PostEntity, {
            id: 1,
            content: 'content',
            tags: ['tag'],
            images: ['image-url'],
            userId: 2,
          }),
        );

        try {
          await usecase.execute(input, userId);
        } catch (err) {
          error = err;
        }
      });

      it('Error code is BAD_REQUEST', () => {
        expect(error.code).toEqual(UsecaseErrorCode.BAD_REQUEST);
      });

      it('Error message is "Unauthorized to delete post"', () => {
        expect(error.message).toEqual('Unauthorized to delete post');
      });

      it('Error info detailCode is UNAUTHORIZED_TO_DELETE_POST', () => {
        expect(error.info.detailCode).toEqual(
          UsecaseErrorDetailCode.UNAUTHORIZED_TO_DELETE_POST,
        );
      });

      it('Error info includes post id', () => {
        expect(error.info.postId).toEqual(input.id);
      });

      it('Error info includes user id', () => {
        expect(error.info.userId).toEqual(userId);
      });
    });
  });

  describe('Normal case', () => {
    describe('Can delete post', () => {
      beforeAll(async () => {
        input = {
          id: 1,
        };

        jest.spyOn(UserRepository.prototype, 'getById').mockResolvedValue(
          plainToClass(UserEntity, {
            id: 1,
            email: 'test@mail.com',
            userName: 'userName',
            detail: null,
          }),
        );

        jest.spyOn(PostRepository.prototype, 'getById').mockResolvedValue(
          plainToClass(PostEntity, {
            id: 1,
            content: 'content',
            tags: ['tag'],
            userId: 1,
          }),
        );

        jest
          .spyOn(PostRepository.prototype, 'deleteById')
          .mockResolvedValue(null);

        output = await usecase.execute(input, userId);
      });

      it('API result code is OK', () => {
        expect(output.result.code).toEqual(ApiResultCode.OK);
      });
    });
  });
});
