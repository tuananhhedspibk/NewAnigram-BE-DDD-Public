import User from '../../rdb/entity/user';
import UserDetail, { Gender } from '../../rdb/entity/user-detail';
import { UserProfileDto } from '@view/dto/user-profile-dto';
import {
  Connection,
  createConnection,
  getRepository,
  Repository,
} from 'typeorm';
import UserViewRepository from '.';
import { users, userDetails } from './testData';

describe('User View Repository testing', () => {
  const userViewRepository = new UserViewRepository();

  let result;

  let rdbConnection: Connection;
  let userRDBRepository: Repository<User>;
  let userDetailRDBRepository: Repository<UserDetail>;

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

  describe('getUserProfileById testing', () => {
    describe('Pass an existing user id', () => {
      beforeAll(async () => {
        result = await userViewRepository.getUserProfileById(1);
      });

      it('Can get user profile', () => {
        const expectResult: UserProfileDto = {
          email: 'user-1@mail.com',
          userName: 'User 1 user name',
          detail: {
            nickName: 'User 1 nick name',
            gender: Gender.Male,
            avatarURL: 'images/avatar.jpg',
          },
        };

        expect(result).toEqual(expectResult);
      });
    });

    describe('Pass a not existing user id', () => {
      beforeAll(async () => {
        result = await userViewRepository.getUserProfileById(100);
      });

      it('Return null', () => {
        expect(result).toEqual(null);
      });
    });
  });
});
