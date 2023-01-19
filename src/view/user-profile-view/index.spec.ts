import UserViewRepository from '@infrastructure/view-repository/user-view-repository';
import { UserProfileDto } from '@view/dto/user-profile-dto';
import UserProfileView from '.';

import { userProfileDto } from './testData';

describe('UserProfileView View Testing', () => {
  let view: UserProfileView;
  let result: UserProfileDto | null;

  beforeAll(async () => {
    view = new UserProfileView(new UserViewRepository());
  });

  describe('getUserProfile Testing', () => {
    describe('Pass an existing user id', () => {
      beforeAll(async () => {
        jest
          .spyOn(UserViewRepository.prototype, 'getUserProfileById')
          .mockResolvedValue(userProfileDto);

        result = await view.getUserProfile(1);
      });

      it('UserProfileDto will be returned', () => {
        expect(result).toEqual(userProfileDto);
      });
    });
    describe('Pass a not existing user id', () => {
      beforeAll(async () => {
        jest
          .spyOn(UserViewRepository.prototype, 'getUserProfileById')
          .mockReturnValue(null);

        result = await view.getUserProfile(2);
      });

      it('null will be returned', () => {
        expect(result).toEqual(null);
      });
    });
  });
});
