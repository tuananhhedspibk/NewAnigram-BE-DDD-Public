import {
  Connection,
  createConnection,
  getRepository,
  Repository,
} from 'typeorm';
import { plainToClass } from '@nestjs/class-transformer';
import { UserEntity } from '@domain/entity/user';
import { EmailVO } from '@domain/value-object/email-vo';

import { UserRepository } from '.';
import User from '../../rdb/entity/user';
import UserDetail, { Gender } from '../../rdb/entity/user-detail';

import { users, userDetails } from './testData';
import {
  InfrastructureErrorCode,
  InfrastructureErrorDetailCode,
} from '@infrastructure/exception';

describe('User Repository Testing', () => {
  const userRepository = new UserRepository();

  let rdbConnection: Connection;
  let userRDBRepository: Repository<User>;
  let userDetailRDBRepository: Repository<UserDetail>;

  let result: UserEntity | null;

  beforeAll(async () => {
    rdbConnection = await createConnection();
    userRDBRepository = getRepository(User);
    userDetailRDBRepository = getRepository(UserDetail);

    await userDetailRDBRepository.delete({});
    await userRDBRepository.delete({});

    await userRDBRepository.insert(users);
    await userDetailRDBRepository.insert(userDetails);
  });
  afterAll(async () => {
    await userDetailRDBRepository.delete({});
    await userRDBRepository.delete({});

    await rdbConnection.close();
  });

  describe('getByEmail testing', () => {
    let email = '';

    describe('Normal case', () => {
      beforeAll(async () => {
        email = 'user-1@mail.com';

        result = await userRepository.getByEmail(null, email);
      });
      it('Can get user with existing email', () => {
        expect(result).toEqual(
          plainToClass(UserEntity, {
            id: 1,
            email: 'user-1@mail.com',
            userName: 'user1',
            detail: {
              nickName: 'user-1-nick-name',
              avatarURL: 'user-1-avatar.jpg',
              gender: Gender.Male,
            },
          }),
        );
      });
    });
    describe('Abnormal case', () => {
      beforeAll(async () => {
        email = 'not-exist@mail.com';

        result = await userRepository.getByEmail(null, email);
      });
      it('Return null because email does not exist', () => {
        expect(result).toEqual(null);
      });
    });
  });

  describe('save testing', () => {
    describe('Normal case', () => {
      const email = 'user-3@mail.com';

      let result;
      let rdbUser: User;

      beforeAll(async () => {
        result = await userRepository.save(
          null,
          plainToClass(UserEntity, {
            email,
            password: '123456',
            userName: 'user3Name',
            detail: null,
          }),
        );

        rdbUser = await userRDBRepository.findOne({
          where: {
            email,
          },
        });
      });

      it('Can save user into database', () => {
        expect(rdbUser).toEqual({
          id: expect.any(Number),
          email,
          password: expect.any(String),
          salt: expect.any(String),
          userName: 'user3Name',
          createdAt: expect.any(Date),
          updatedAt: expect.any(Date),
        });
      });
      it('Response a user entity', () => {
        expect(result).toEqual({
          id: expect.any(Number),
          password: expect.any(String),
          userName: 'user3Name',
          email: 'user-3@mail.com',
          detail: null,
        });
      });
    });
  });

  describe('getById testing', () => {
    let id: number;

    describe('Normal case', () => {
      describe('Can get user who has existing id', () => {
        beforeAll(async () => {
          id = 1;

          result = await userRepository.getById(null, id);
        });

        it('UserEntity will be returned', () => {
          expect(result).toEqual(
            plainToClass(UserEntity, {
              id: 1,
              email: 'user-1@mail.com',
              userName: 'user1',
              detail: {
                nickName: 'user-1-nick-name',
                avatarURL: 'user-1-avatar.jpg',
                gender: Gender.Male,
              },
            }),
          );
        });
      });
    });

    describe('Abnormal case', () => {
      describe('Can not get user with not existing id', () => {
        beforeAll(async () => {
          id = 100000000;

          result = await userRepository.getById(null, id);
        });

        it('null will be returned', () => {
          expect(result).toEqual(null);
        });
      });
    });
  });

  describe('update testing', () => {
    describe('Normal case', () => {
      let userEntity: UserEntity;
      let newestUserData;
      let newestUserDetailData;

      describe('User has detail', () => {
        beforeAll(async () => {
          userEntity = plainToClass(UserEntity, {
            id: 1,
            email: 'user-100@mail.com',
            password: 'password',
            salt: '10',
            userName: 'user100',
            createdAt: new Date(),
            updatedAt: new Date(),
            detail: {
              id: 1,
              userId: 1,
              nickName: 'user-100-nick-name',
              avatarURL: 'user-100-avatar.jpg',
              gender: Gender.Female,
              createdAt: new Date(),
              updatedAt: new Date(),
            },
          });

          await userRepository.update(null, userEntity);

          newestUserData = await userRDBRepository.findOne(userEntity.id);
          newestUserDetailData = await userDetailRDBRepository.findOne(
            userEntity.detail.id,
          );
        });

        it('User data (email, userName) is updated', () => {
          expect(newestUserData.email).toEqual('user-100@mail.com');
          expect(newestUserData.userName).toEqual('user100');
        });

        it('User detail data (nickName, avatarURL, gender) is updated', () => {
          expect(newestUserDetailData.nickName).toEqual('user-100-nick-name');
          expect(newestUserDetailData.avatarURL).toEqual('user-100-avatar.jpg');
          expect(newestUserDetailData.gender).toEqual(Gender.Female);
        });
      });
    });

    describe('Abnormal case', () => {
      let error;

      describe('Not specify user id', () => {
        beforeAll(async () => {
          try {
            await userRepository.update(
              null,
              plainToClass(UserEntity, {
                email: 'test@mail.com',
                userName: 'userName',
                detail: {
                  nickName: 'nick-name',
                  gender: Gender.Male,
                  avatarURL: 'avatarURL',
                },
              }),
            );
          } catch (err) {
            error = err;
          }
        });

        it('Error code is BAD_REQUEST', () => {
          expect(error.code).toEqual(InfrastructureErrorCode.BAD_REQUEST);
        });
        it('Error message is "Must specify user id"', () => {
          expect(error.message).toEqual('Must specify user id');
        });
        it('Error detail code is MUST_SPECIFY_USER_ID', () => {
          expect(error.info.errorCode).toEqual(
            InfrastructureErrorDetailCode.MUST_SPECIFY_USER_ID,
          );
        });
      });

      describe('Try to update not exist user', () => {
        beforeAll(async () => {
          try {
            await userRepository.update(
              null,
              plainToClass(UserEntity, {
                id: 100000000,
                email: 'test@mail.com',
                userName: 'userName',
                detail: {
                  nickName: 'nick-name',
                  gender: Gender.Male,
                  avatarURL: 'avatarURL',
                },
              }),
            );
          } catch (err) {
            error = err;
          }
        });
        it('Error code is NOT_FOUND', () => {
          expect(error.code).toEqual(InfrastructureErrorCode.NOT_FOUND);
        });
        it('Error message is "User does not exist"', () => {
          expect(error.message).toEqual('User does not exist');
        });
        it('Error detail code is RDB_USER_NOT_EXIST', () => {
          expect(error.info.errorCode).toEqual(
            InfrastructureErrorDetailCode.RDB_USER_NOT_EXIST,
          );
        });
      });
    });
  });
});
