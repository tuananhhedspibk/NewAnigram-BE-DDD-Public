import { Connection, createConnection } from 'typeorm';

import UserFeedView, { UserFeedViewOutput } from '.';
import UserViewRepository from '@infrastructure/view-repository/user-view-repository';

import { userFeedPosts, userProfileDto } from './testData';
import { ViewErrorCode, ViewErrorDetailCode } from '@view/exception';

describe('UserFeedView Testing', () => {
  let view: UserFeedView;
  let result: UserFeedViewOutput;
  let connection: Connection;

  let userId: number;
  let page: number;

  beforeAll(async () => {
    view = new UserFeedView(new UserViewRepository());

    connection = await createConnection();
  });
  afterAll(async () => {
    await connection.close();
  });

  describe('getUserFeed Testing', () => {
    describe('Abnormal case', () => {
      let error;

      describe('Pass a non-exist user id', () => {
        beforeAll(async () => {
          userId = 1;
          page = 1;

          jest
            .spyOn(UserViewRepository.prototype, 'getUserProfileById')
            .mockResolvedValue(null);

          try {
            await view.getUserFeed(userId, page);
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
      beforeAll(async () => {
        userId = 1;
        page = 1;

        jest
          .spyOn(UserViewRepository.prototype, 'getUserProfileById')
          .mockResolvedValue(userProfileDto);

        jest
          .spyOn(UserViewRepository.prototype, 'getUserFeed')
          .mockResolvedValue(userFeedPosts);

        result = await view.getUserFeed(userId, page);
      });

      it('Result is as expected', () => {
        expect(result).toEqual({ data: userFeedPosts });
      });
    });
  });
});
