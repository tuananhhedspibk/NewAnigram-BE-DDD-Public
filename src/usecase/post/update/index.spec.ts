import { Connection, createConnection } from 'typeorm';
import { plainToClass } from '@nestjs/class-transformer';

import { UserEntity } from '@domain/entity/user';

import { PostRepository } from '@infrastructure/repository/post';
import TransactionManager from '@infrastructure/repository/transaction';
import { UserRepository } from '@infrastructure/repository/user';

import { UsecaseErrorCode, UsecaseErrorDetailCode } from '@usecase/exception';

import UpdatePostUsecase, {
  UpdatedPostDto,
  UpdatePostUsecaseInput,
  UpdatePostUsecaseOutput,
} from '.';
import { PostEntity } from '@domain/entity/post';
import { ApiResultCode } from '@usecase/dto/api-result';

describe('UpdatePost Usecase Testing', () => {
  let input: UpdatePostUsecaseInput;
  let output: UpdatePostUsecaseOutput;
  let usecase: UpdatePostUsecase;
  let connection: Connection;

  const userId = 1;

  beforeAll(async () => {
    usecase = new UpdatePostUsecase(
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
          content: 'new content',
          tags: ['new-tag-1', 'new-tag-2'],
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
          content: 'New content',
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

    describe('Post is not user property', () => {
      beforeAll(async () => {
        input = {
          id: 1,
          tags: ['new-tag'],
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

      it('Error message is "This post is not your property"', () => {
        expect(error.message).toEqual('This post is not your property');
      });

      it('Error info detailCode is POST_IS_NOT_USER_PROPERTY', () => {
        expect(error.info.detailCode).toEqual(
          UsecaseErrorDetailCode.POST_IS_NOT_USER_PROPERTY,
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
    describe('Update content only', () => {
      beforeAll(async () => {
        input = {
          id: 1,
          content: 'new content',
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

        jest.spyOn(PostRepository.prototype, 'update').mockResolvedValue(null);

        output = await usecase.execute(input, userId);
      });

      it('API result code is OK', () => {
        expect(output.result.code).toEqual(ApiResultCode.OK);
      });

      it('Response post is as expected', () => {
        expect(output.post).toEqual({
          id: 1,
          content: 'new content',
          tags: ['tag'],
        });
      });

      it('Reponse post type is UpdatedPostDto', () => {
        expect(output.post).toBeInstanceOf(UpdatedPostDto);
      });
    });

    describe('Update tags only', () => {
      beforeAll(async () => {
        input = {
          id: 1,
          tags: ['new tag'],
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

        jest.spyOn(PostRepository.prototype, 'update').mockResolvedValue(null);

        output = await usecase.execute(input, userId);
      });

      it('API result code is OK', () => {
        expect(output.result.code).toEqual(ApiResultCode.OK);
      });

      it('Response post is as expected', () => {
        expect(output.post).toEqual({
          id: 1,
          content: 'content',
          tags: ['new tag'],
        });
      });

      it('Reponse post type is UpdatedPostDto', () => {
        expect(output.post).toBeInstanceOf(UpdatedPostDto);
      });
    });

    describe('Update content, tags together', () => {
      beforeAll(async () => {
        input = {
          id: 1,
          content: 'new content',
          tags: ['new tag'],
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

        jest.spyOn(PostRepository.prototype, 'update').mockResolvedValue(null);

        output = await usecase.execute(input, userId);
      });

      it('API result code is OK', () => {
        expect(output.result.code).toEqual(ApiResultCode.OK);
      });

      it('Response post is as expected', () => {
        expect(output.post).toEqual({
          id: 1,
          content: 'new content',
          tags: ['new tag'],
        });
      });

      it('Reponse post type is UpdatedPostDto', () => {
        expect(output.post).toBeInstanceOf(UpdatedPostDto);
      });
    });

    describe('Do not update anything', () => {
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

        jest.spyOn(PostRepository.prototype, 'update').mockResolvedValue(null);

        output = await usecase.execute(input, userId);
      });

      it('API result code is OK', () => {
        expect(output.result.code).toEqual(ApiResultCode.OK);
      });

      it('Response post is as expected', () => {
        expect(output.post).toEqual({
          id: 1,
          content: 'content',
          tags: ['tag'],
        });
      });

      it('Reponse post type is UpdatedPostDto', () => {
        expect(output.post).toBeInstanceOf(UpdatedPostDto);
      });
    });
  });
});
