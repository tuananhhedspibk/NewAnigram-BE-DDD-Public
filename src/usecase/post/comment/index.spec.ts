import { Connection, createConnection } from 'typeorm';
import { plainToClass } from '@nestjs/class-transformer';

import { UserEntity } from '@domain/entity/user';
import { PostEntity } from '@domain/entity/post';

import CommentPostUsecase, {
  CommentPostUsecaseInput,
  CommentPostUsecaseOutput,
} from '.';
import { UsecaseErrorCode, UsecaseErrorDetailCode } from '@usecase/exception';
import { ApiResultCode } from '@usecase/dto/api-result';

import { CommentRepository } from '@infrastructure/repository/comment';
import { PostRepository } from '@infrastructure/repository/post';
import TransactionManager from '@infrastructure/repository/transaction';
import { UserRepository } from '@infrastructure/repository/user';

describe('CommentPost Usecase Testing', () => {
  let input: CommentPostUsecaseInput;
  let output: CommentPostUsecaseOutput;
  let usecase: CommentPostUsecase;
  let connection: Connection;

  const userId = 1;
  const postId = 1;

  beforeAll(async () => {
    usecase = new CommentPostUsecase(
      new UserRepository(),
      new PostRepository(),
      new CommentRepository(),
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
          content: 'comment',
        };

        jest.spyOn(UserRepository.prototype, 'getById').mockResolvedValue(null);

        try {
          await usecase.execute(input, { postId, userId });
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
    });

    describe('Post does not exist', () => {
      beforeAll(async () => {
        input = {
          content: 'comment',
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
          await usecase.execute(input, { postId, userId });
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
    });

    describe('Comment content is empty', () => {
      beforeAll(async () => {
        input = {
          content: '',
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

        try {
          await usecase.execute(input, { postId, userId });
        } catch (err) {
          error = err;
        }
      });

      it('Error code is BAD_REQUEST', () => {
        expect(error.code).toEqual(UsecaseErrorCode.BAD_REQUEST);
      });

      it('Error message is "Content can not be empty"', () => {
        expect(error.message).toEqual('Content can not be empty');
      });

      it('Error info detailCode is COMMENT_CONTENT_CAN_NOT_EMPTY', () => {
        expect(error.info.detailCode).toEqual(
          UsecaseErrorDetailCode.COMMENT_CONTENT_CAN_NOT_EMPTY,
        );
      });
    });
  });

  describe('Normal case', () => {
    beforeAll(async () => {
      input = {
        content: 'new comment content',
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

      jest.spyOn(CommentRepository.prototype, 'save').mockResolvedValue(null);

      output = await usecase.execute(input, { postId, userId });
    });

    it('Response code is OK', () => {
      expect(output.result.code).toEqual(ApiResultCode.OK);
    });
  });
});
