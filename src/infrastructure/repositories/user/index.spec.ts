import {
  Connection,
  createConnection,
  getRepository,
  Repository,
} from 'typeorm';
import { users } from './testData';
import { UserRepository } from '.';
import User from '../../rdb/entities/user';
import { UserEntity } from '@domain/entities/user';

describe('User Repository Testing', () => {
  const userRepository = new UserRepository();

  let rdbConnection: Connection;
  let userRdbRepository: Repository<User>;

  beforeAll(async () => {
    rdbConnection = await createConnection();
    userRdbRepository = getRepository(User);

    await userRdbRepository.delete({});

    await userRdbRepository.insert(users);
  });
  afterAll(async () => {
    await userRdbRepository.delete({});

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
});
