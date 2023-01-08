import { Connection, createConnection } from 'typeorm';
import { plainToClass } from '@nestjs/class-transformer';

import ImageRepository from '@infrastructure/repository/image';
import { PostRepository } from '@infrastructure/repository/post';
import TransactionManager from '@infrastructure/repository/transaction';
import { UserRepository } from '@infrastructure/repository/user';

import CreatePostUsecase, {
  CreatePostUsecaseInput,
  CreatePostUsecaseOutput,
  CreatedPostDto,
} from '.';
import { UsecaseErrorCode, UsecaseErrorDetailCode } from '@usecase/exception';
import { ApiResultCode } from '@usecase/dto/api-result';

import { UserEntity } from '@domain/entity/user';
import { PostEntity } from '@domain/entity/post';
import { DomainImageType, ImageInfoPayload } from '@domain/repository/image';

describe('CreatePost Usecase Testing', () => {
  let input: CreatePostUsecaseInput;
  let output: CreatePostUsecaseOutput;
  let usecase: CreatePostUsecase;
  let connection: Connection;

  const userId = 1;

  beforeAll(async () => {
    usecase = new CreatePostUsecase(
      new UserRepository(),
      new ImageRepository(),
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
          content: 'content',
          images: [
            {
              fieldname: 'images',
              originalname: 'test1.jpeg',
              encoding: '7bit',
              mimetype: 'image/jpeg',
              buffer: Buffer.from('test image 1'),
              size: 67418,
            },
          ],
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

      it('Error info includes user id', () => {
        expect(error.info.userId).toEqual(userId);
      });
    });

    describe('Do not submit any pictures', () => {
      beforeAll(async () => {
        input = {
          content: 'Post content',
          tags: ['tag-1', 'tag-2'],
          images: null,
        };

        jest.spyOn(UserRepository.prototype, 'getById').mockResolvedValue(
          plainToClass(UserEntity, {
            id: 1,
            email: 'test@mail.com',
            userName: 'userName',
            detail: null,
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

      it('Error message is "Post must have at least one image"', () => {
        expect(error.message).toEqual('Post must have at least one image');
      });

      it('Error info detail code is POST_MUST_HAVE_IMAGE', () => {
        expect(error.info.detailCode).toEqual(
          UsecaseErrorDetailCode.POST_MUST_HAVE_IMAGE,
        );
      });
    });

    describe('Submit no pictures', () => {
      beforeAll(async () => {
        input = {
          content: 'Post content',
          tags: ['tag-1', 'tag-2'],
          images: [],
        };

        jest.spyOn(UserRepository.prototype, 'getById').mockResolvedValue(
          plainToClass(UserEntity, {
            id: 1,
            email: 'test@mail.com',
            userName: 'userName',
            detail: null,
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

      it('Error message is "Post must have at least one image"', () => {
        expect(error.message).toEqual('Post must have at least one image');
      });

      it('Error info detail code is POST_MUST_HAVE_IMAGE', () => {
        expect(error.info.detailCode).toEqual(
          UsecaseErrorDetailCode.POST_MUST_HAVE_IMAGE,
        );
      });
    });

    describe('Submit more than 10 pictures', () => {
      beforeAll(async () => {
        input = {
          images: [
            {
              fieldname: 'images',
              originalname: 'test1.jpeg',
              encoding: '7bit',
              mimetype: 'image/jpeg',
              buffer: Buffer.from('test image 1'),
              size: 67418,
            },
            {
              fieldname: 'images',
              originalname: 'test2.jpeg',
              encoding: '7bit',
              mimetype: 'image/jpeg',
              buffer: Buffer.from('test image 2'),
              size: 67418,
            },
            {
              fieldname: 'images',
              originalname: 'test3.jpeg',
              encoding: '7bit',
              mimetype: 'image/jpeg',
              buffer: Buffer.from('test image 3'),
              size: 67418,
            },
            {
              fieldname: 'images',
              originalname: 'test4.jpeg',
              encoding: '7bit',
              mimetype: 'image/jpeg',
              buffer: Buffer.from('test image 4'),
              size: 67418,
            },
            {
              fieldname: 'images',
              originalname: 'test5.jpeg',
              encoding: '7bit',
              mimetype: 'image/jpeg',
              buffer: Buffer.from('test image 5'),
              size: 67418,
            },
            {
              fieldname: 'images',
              originalname: 'test6.jpeg',
              encoding: '7bit',
              mimetype: 'image/jpeg',
              buffer: Buffer.from('test image 6'),
              size: 67418,
            },
            {
              fieldname: 'images',
              originalname: 'test7.jpeg',
              encoding: '7bit',
              mimetype: 'image/jpeg',
              buffer: Buffer.from('test image 7'),
              size: 67418,
            },
            {
              fieldname: 'images',
              originalname: 'test8.jpeg',
              encoding: '7bit',
              mimetype: 'image/jpeg',
              buffer: Buffer.from('test image 8'),
              size: 67418,
            },
            {
              fieldname: 'images',
              originalname: 'test9.jpeg',
              encoding: '7bit',
              mimetype: 'image/jpeg',
              buffer: Buffer.from('test image 9'),
              size: 67418,
            },
            {
              fieldname: 'images',
              originalname: 'test10.jpeg',
              encoding: '7bit',
              mimetype: 'image/jpeg',
              buffer: Buffer.from('test image 10'),
              size: 67418,
            },
            {
              fieldname: 'images',
              originalname: 'test11.jpeg',
              encoding: '7bit',
              mimetype: 'image/jpeg',
              buffer: Buffer.from('test image 11'),
              size: 67418,
            },
          ],
        };

        jest.spyOn(UserRepository.prototype, 'getById').mockResolvedValue(
          plainToClass(UserEntity, {
            id: 1,
            email: 'test@mail.com',
            userName: 'userName',
            detail: null,
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

      it('Error message is "Post can have maximum 10 pictures"', () => {
        expect(error.message).toEqual('Post can have maximum 10 pictures');
      });

      it('Error info detailCode is NUMBER_OF_PICS_LIMITED', () => {
        expect(error.info.detailCode).toEqual(
          UsecaseErrorDetailCode.NUMBER_OF_PICS_LIMITED,
        );
      });
    });
  });

  describe('Normal case', () => {
    beforeAll(async () => {
      input = {
        content: 'Post content',
        tags: ['tag-1', 'tag-2'],
        images: [
          {
            fieldname: 'images',
            originalname: 'test1.jpeg',
            encoding: '7bit',
            mimetype: 'image/jpeg',
            buffer: Buffer.from('test image 1'),
            size: 67418,
          },
          {
            fieldname: 'images',
            originalname: 'test2.jpeg',
            encoding: '7bit',
            mimetype: 'image/jpeg',
            buffer: Buffer.from('test image 2'),
            size: 67418,
          },
        ],
      };

      jest.spyOn(UserRepository.prototype, 'getById').mockResolvedValue(
        plainToClass(UserEntity, {
          id: 1,
          email: 'test@mail.com',
          userName: 'userName',
          detail: null,
        }),
      );

      jest.spyOn(PostRepository.prototype, 'save').mockResolvedValue(
        plainToClass(PostEntity, {
          id: 1,
          likes: [],
          comments: [],
          tags: ['tag-1', 'tag-2'],
          content: 'Post content',
          images: [],
          userId: 1,
          createdAt: new Date('2023-01-07 00:00:00'),
        }),
      );

      jest.spyOn(PostRepository.prototype, 'update').mockResolvedValue(
        plainToClass(PostEntity, {
          id: 1,
          likes: [],
          comments: [],
          tags: ['tag-1', 'tag-2'],
          content: 'Post content',
          images: [{ url: 'image-1.jpeg' }, { url: 'image-2.jpeg' }],
          userId: 1,
          createdAt: new Date('2023-01-07 00:00:00'),
        }),
      );

      jest
        .spyOn(ImageRepository.prototype, 'generateKey')
        .mockImplementation(
          (_domainImageType: DomainImageType, payload: ImageInfoPayload) => {
            if (payload.name === 'test1.jpeg') {
              return 'test1-key.jpeg';
            }
            return 'test2-key.jpeg';
          },
        );

      jest
        .spyOn(ImageRepository.prototype, 'generateGetURL')
        .mockImplementation((key: string) => {
          if (key === 'test1-key.jpeg') {
            return 'https://s3.aws.com/users/1/posts/1/test1-key.jpeg';
          }

          return 'https://s3.aws.com/users/1/posts/1/test2-key.jpeg';
        });

      jest
        .spyOn(ImageRepository.prototype, 'uploadImageToImageServer')
        .mockResolvedValue(null);

      output = await usecase.execute(input, userId);
    });

    it('Outputs post data type is PostDto', () => {
      expect(output.post).toBeInstanceOf(CreatedPostDto);
    });

    it('Outputs post data is as expected', () => {
      expect(output.post).toEqual({
        id: 1,
        images: [
          'https://s3.aws.com/users/1/posts/1/test1-key.jpeg',
          'https://s3.aws.com/users/1/posts/1/test2-key.jpeg',
        ],
        tags: ['tag-1', 'tag-2'],
        content: 'Post content',
        createdAt: new Date('2023-01-07 00:00:00'),
      });
    });

    it('Output result code is OK', () => {
      expect(output.result.code).toBe(ApiResultCode.OK);
    });
  });
});
