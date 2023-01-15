import { plainToClass } from '@nestjs/class-transformer';
import { Connection, createConnection } from 'typeorm';

import { PostEntity } from '@domain/entity/post';
import { CommentEntity } from '@domain/entity/post/comment';
import { UserEntity } from '@domain/entity/user';

import { UsecaseErrorCode, UsecaseErrorDetailCode } from '@usecase/exception';
import UpdatePostCommentUsecase, {
  UpdatePostCommentUsecaseInput,
  UpdatePostCommentUsecaseOutput,
} from '.';
import { ApiResultCode } from '@usecase/dto/api-result';

import { CommentRepository } from '@infrastructure/repository/comment';
import { PostRepository } from '@infrastructure/repository/post';
import TransactionManager from '@infrastructure/repository/transaction';
import { UserRepository } from '@infrastructure/repository/user';

describe('UpdatePostComment Usecase Testing', () => {
  let input: UpdatePostCommentUsecaseInput;
  let output: UpdatePostCommentUsecaseOutput;
  let usecase: UpdatePostCommentUsecase;
  let connection: Connection;

  const userId = 1;
  const postId = 1;
  const commentId = 1;

  beforeAll(async () => {
    usecase = new UpdatePostCommentUsecase(
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
          content: 'new content',
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
          commentId,
          postId,
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
        expect(error.info.postId).toEqual(postId);
      });
    });

    describe('Comment does not exist', () => {
      beforeAll(async () => {
        input = {
          postId,
          commentId,
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

        jest.spyOn(PostRepository.prototype, 'getById').mockResolvedValue(
          plainToClass(PostEntity, {
            id: 1,
            content: 'content',
            tags: ['tag'],
            images: ['image-url'],
            userId: 2,
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

      it('Error info includes comment id', () => {
        expect(error.info.commentId).toEqual(commentId);
      });
    });

    describe('Unauthorized to update comment', () => {
      beforeAll(async () => {
        input = {
          postId,
          commentId,
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

        jest.spyOn(PostRepository.prototype, 'getById').mockResolvedValue(
          plainToClass(PostEntity, {
            id: 1,
            content: 'content',
            tags: ['tag'],
            images: ['image-url'],
            userId: 2,
          }),
        );

        jest.spyOn(CommentRepository.prototype, 'getById').mockResolvedValue(
          plainToClass(CommentEntity, {
            id: 1,
            postId: 1,
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

      it('Error message is "Unauthorized to update comment"', () => {
        expect(error.message).toEqual('Unauthorized to update comment');
      });

      it('Error info detailCode is UNAUTHORIZED_TO_UPDATE_COMMENT', () => {
        expect(error.info.detailCode).toEqual(
          UsecaseErrorDetailCode.UNAUTHORIZED_TO_UPDATE_COMMENT,
        );
      });
    });

    describe('Comment content can not be empty', () => {
      beforeAll(async () => {
        input = {
          postId,
          commentId,
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
            content: 'content',
            tags: ['tag'],
            images: ['image-url'],
            userId: 2,
          }),
        );

        jest.spyOn(CommentRepository.prototype, 'getById').mockResolvedValue(
          plainToClass(CommentEntity, {
            id: 1,
            postId: 1,
            userId: 1,
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

      it('Error message is "Comment content can not be empty"', () => {
        expect(error.message).toEqual('Comment content can not be empty');
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
        postId,
        commentId,
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

      jest.spyOn(PostRepository.prototype, 'getById').mockResolvedValue(
        plainToClass(PostEntity, {
          id: 1,
          content: 'content',
          tags: ['tag'],
          images: ['image-url'],
          userId: 2,
        }),
      );

      jest.spyOn(CommentRepository.prototype, 'getById').mockResolvedValue(
        plainToClass(CommentEntity, {
          id: 1,
          postId: 1,
          userId: 1,
        }),
      );

      jest.spyOn(CommentRepository.prototype, 'update').mockResolvedValue(null);

      output = await usecase.execute(input, userId);
    });

    it('Response code is OK', () => {
      expect(output.result.code).toEqual(ApiResultCode.OK);
    });
  });
});
