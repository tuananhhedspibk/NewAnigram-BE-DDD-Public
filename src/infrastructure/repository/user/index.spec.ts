import {
  Connection,
  createConnection,
  getRepository,
  Repository,
} from 'typeorm';
import { users } from './testData';
import { UserRepository } from '.';
import User from '../../rdb/entity/user';
import { UserEntity } from '@domain/entity/user';
import { EmailVO } from '@domain/value-object/email-vo';

describe('User Repository Testing', () => {
  const userRepository = new UserRepository();

  let rdbConnection: Connection;
  let userRDBRepository: Repository<User>;

  beforeAll(async () => {
    rdbConnection = await createConnection();
    userRDBRepository = getRepository(User);

    await userRDBRepository.delete({});

    await userRDBRepository.insert(users);
  });
  afterAll(async () => {
    await userRDBRepository.delete({});

    await rdbConnection.close();
  });

  describe('getByEmail testing', () => {
    let result: UserEntity | null;
    let email = '';

    describe('Normal case', () => {
      beforeAll(async () => {
        email = 'user-1@mail.com';

        result = await userRepository.getByEmail(null, email);
      });
      it('Can get user with existing email', () => {
        expect(result).toEqual({
          id: 1,
          email: 'user-1@mail.com',
          userName: 'user1',
          detail: null,
        });
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
        result = await userRepository.save(null, {
          email: new EmailVO(email),
          password: '123456',
          userName: 'user3Name',
          detail: null,
        });

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
});
