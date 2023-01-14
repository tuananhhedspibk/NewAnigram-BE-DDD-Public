import { plainToClass } from '@nestjs/class-transformer';
import { Connection, createConnection } from 'typeorm';

import { UserEntity } from '@domain/entity/user';
import { PostEntity } from '@domain/entity/post';
import { LikeEntity } from '@domain/entity/post/like';

import { UsecaseErrorCode, UsecaseErrorDetailCode } from '@usecase/exception';
import UnlikePostUsecase, {
  UnlikePostUsecaseInput,
  UnlikePostUsecaseOutput,
} from '.';

import { LikeRepository } from '@infrastructure/repository/like';
import { PostRepository } from '@infrastructure/repository/post';
import TransactionManager from '@infrastructure/repository/transaction';
import { UserRepository } from '@infrastructure/repository/user';
import { ApiResultCode } from '@usecase/dto/api-result';

describe('UnlikePost Usecase Testing', () => {
  let input: UnlikePostUsecaseInput;
  let output: UnlikePostUsecaseOutput;
  let usecase: UnlikePostUsecase;
  let connection: Connection;

  const userId = 1;

  beforeAll(async () => {
    usecase = new UnlikePostUsecase(
      new UserRepository(),
      new PostRepository(),
      new LikeRepository(),
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
          postId: 1,
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

      it('Error info detailCode is USER_NOT_EXIST', () => {
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
          postId: 1,
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

      it('Error message is "Post does not exist"', () => {
        expect(error.message).toEqual('Post does not exist');
      });

      it('Error info detailCode is POST_NOT_EXIST', () => {
        expect(error.info.detailCode).toEqual(
          UsecaseErrorDetailCode.POST_NOT_EXIST,
        );
      });

      it('Error info includes postId', () => {
        expect(error.info.postId).toEqual(input.postId);
      });
    });

    describe('Have not liked post', () => {
      beforeAll(async () => {
        input = {
          postId: 1,
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
            userId: 1,
            content: 'content',
            tags: ['tag'],
            images: ['image-url'],
          }),
        );

        jest
          .spyOn(LikeRepository.prototype, 'getByPostAndUserId')
          .mockResolvedValue(null);

        try {
          await usecase.execute(input, userId);
        } catch (err) {
          error = err;
        }
      });

      it('Error code is BAD_REQUEST', () => {
        expect(error.code).toEqual(UsecaseErrorCode.BAD_REQUEST);
      });

      it('Error message is "You have not liked this post"', () => {
        expect(error.message).toEqual('You have not liked this post');
      });

      it('Error info detailCode is HAVE_NOT_LIKED_POST', () => {
        expect(error.info.detailCode).toEqual(
          UsecaseErrorDetailCode.HAVE_NOT_LIKED_POST,
        );
      });
    });
  });

  describe('Normal case', () => {
    beforeAll(async () => {
      input = {
        postId: 1,
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
          userId: 1,
          content: 'content',
          tags: ['tag'],
          images: ['image-url'],
        }),
      );

      jest
        .spyOn(LikeRepository.prototype, 'getByPostAndUserId')
        .mockResolvedValue(
          plainToClass(LikeEntity, {
            id: 1,
            postId: 1,
            userId: 1,
          }),
        );

      jest
        .spyOn(LikeRepository.prototype, 'deleteById')
        .mockResolvedValue(null);

      output = await usecase.execute(input, userId);
    });

    it('Response code is OK', () => {
      expect(output.result.code).toEqual(ApiResultCode.OK);
    });
  });
});
