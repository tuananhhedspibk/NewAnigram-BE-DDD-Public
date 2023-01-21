import { Connection, createConnection } from 'typeorm';

import UserPostsView, { UserPostsViewOutput } from '.';

import { ViewErrorCode, ViewErrorDetailCode } from '@view/exception';

import PostViewRepository from '@infrastructure/view-repository/post-view-repository';
import UserViewRepository from '@infrastructure/view-repository/user-view-repository';

import { userProfileDto, userPostsDto } from './testData';

describe('UserPostsView Testing', () => {
  let view: UserPostsView;
  let result: UserPostsViewOutput;

  let connection: Connection;

  beforeAll(async () => {
    view = new UserPostsView(
      new PostViewRepository(),
      new UserViewRepository(),
    );

    connection = await createConnection();
  });
  afterAll(async () => {
    await connection.close();
  });

  describe('getUserPosts Testing', () => {
    describe('Abnormal case', () => {
      let error;

      describe('Pass a non-exist user id', () => {
        beforeAll(async () => {
          jest
            .spyOn(UserViewRepository.prototype, 'getUserProfileById')
            .mockResolvedValue(null);

          try {
            await view.getUserPosts(1);
          } catch (err) {
            error = err;
          }
        });

        it('Error code is NOT_FOUND', () => {
          expect(error.code).toEqual(ViewErrorCode.NOT_FOUND);
        });

        it('Error message is "User does not exist"', () => {
          expect(error.message).toEqual('User does not exist');
        });

        it('Error info detailCode is USER_NOT_EXIST', () => {
          expect(error.info.detailCode).toEqual(
            ViewErrorDetailCode.USER_NOT_EXIST,
          );
        });
      });
    });

    describe('Normal case', () => {
      describe('Pass id of the user that does not have any posts', () => {
        beforeAll(async () => {
          jest
            .spyOn(UserViewRepository.prototype, 'getUserProfileById')
            .mockResolvedValue(userProfileDto);

          jest
            .spyOn(PostViewRepository.prototype, 'getUserPosts')
            .mockResolvedValue([]);

          result = await view.getUserPosts(1);
        });

        it('Result is as expected', () => {
          expect(result).toEqual({
            data: [],
          });
        });
      });

      describe('Pass id of the user that does not have posts', () => {
        beforeAll(async () => {
          jest
            .spyOn(UserViewRepository.prototype, 'getUserProfileById')
            .mockResolvedValue(userProfileDto);

          jest
            .spyOn(PostViewRepository.prototype, 'getUserPosts')
            .mockResolvedValue(userPostsDto);

          result = await view.getUserPosts(1);
        });

        it('Result is as expected', () => {
          expect(result).toEqual({
            data: userPostsDto,
          });
        });
      });
    });
  });
});
