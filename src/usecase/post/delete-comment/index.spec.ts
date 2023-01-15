import { Connection, createConnection } from 'typeorm';
import { plainToClass } from '@nestjs/class-transformer';

import { UserEntity } from '@domain/entity/user';

import DeletePostCommentUsecase, {
  DeletePostCommentUsecaseInput,
  DeletePostCommentUsecaseOutput,
} from '.';

import { CommentRepository } from '@infrastructure/repository/comment';
import { PostRepository } from '@infrastructure/repository/post';
import TransactionManager from '@infrastructure/repository/transaction';
import { UserRepository } from '@infrastructure/repository/user';
import { UsecaseErrorCode, UsecaseErrorDetailCode } from '@usecase/exception';
import { PostEntity } from '@domain/entity/post';
import { CommentEntity } from '@domain/entity/post/comment';
import { ApiResultCode } from '@usecase/dto/api-result';

describe('DeletePostComment Usecase Testing', () => {
  let input: DeletePostCommentUsecaseInput;
  let output: DeletePostCommentUsecaseOutput;
  let usecase: DeletePostCommentUsecase;
  let connection: Connection;

  const userId = 1;
  const postId = 1;
  const commentId = 1;

  beforeAll(async () => {
    usecase = new DeletePostCommentUsecase(
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
          postId,
          commentId,
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
          postId,
          commentId,
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

    describe('Comment does not exist', () => {
      beforeAll(async () => {
        input = {
          postId,
          commentId,
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
          .spyOn(CommentRepository.prototype, 'getById')
          .mockResolvedValue(null);

        try {
          await usecase.execute(input, userId);
        } catch (err) {
          error = err;
        }
      });

      it('Error code is NOT_FOUND', () => {
        expect(error.code).toEqual(UsecaseErrorCode.NOT_FOUND);
      });

      it('Error message is "Comment does not exist"', () => {
        expect(error.message).toEqual('Comment does not exist');
      });

      it('Error info detailCode is COMMENT_NOT_EXIST', () => {
        expect(error.info.detailCode).toEqual(
          UsecaseErrorDetailCode.COMMENT_NOT_EXIST,
        );
      });

      it('Error info includes commentId', () => {
        expect(error.info.commentId).toEqual(commentId);
      });
    });

    describe('Unauthorized to delete comment', () => {
      beforeAll(async () => {
        input = {
          postId,
          commentId,
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
            userId: 2,
            content: 'content',
            tags: ['tag'],
            images: ['image-url'],
          }),
        );

        jest.spyOn(CommentRepository.prototype, 'getById').mockResolvedValue(
          plainToClass(CommentEntity, {
            id: 1,
            userId: 2,
            postId: 2,
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

      it('Error message is "Unauthorized to delete comment"', () => {
        expect(error.message).toEqual('Unauthorized to delete comment');
      });

      it('Error info detailCode is UNAUTHORIZED_TO_DELETE_COMMENT', () => {
        expect(error.info.detailCode).toEqual(
          UsecaseErrorDetailCode.UNAUTHORIZED_TO_DELETE_COMMENT,
        );
      });
    });

    describe('Is not comment of post', () => {
      beforeAll(async () => {
        input = {
          postId,
          commentId,
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

        jest.spyOn(CommentRepository.prototype, 'getById').mockResolvedValue(
          plainToClass(CommentEntity, {
            id: 1,
            userId: 1,
            postId: 2,
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

      it('Error message is "Is not comment of post"', () => {
        expect(error.message).toEqual('Is not comment of post');
      });

      it('Error info detailCode is IS_NOT_COMMENT_OF_POST', () => {
        expect(error.info.detailCode).toEqual(
          UsecaseErrorDetailCode.IS_NOT_COMMENT_OF_POST,
        );
      });
    });
  });

  describe('Normal case', () => {
    beforeAll(async () => {
      input = {
        postId,
        commentId,
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

      jest.spyOn(CommentRepository.prototype, 'getById').mockResolvedValue(
        plainToClass(CommentEntity, {
          id: 1,
          userId: 1,
          postId: 1,
        }),
      );

      jest
        .spyOn(CommentRepository.prototype, 'deleteById')
        .mockResolvedValue(null);

      output = await usecase.execute(input, userId);
    });

    it('Response code is OK', () => {
      expect(output.result.code).toEqual(ApiResultCode.OK);
    });
  });
});
