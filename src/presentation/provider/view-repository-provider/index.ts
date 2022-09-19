import UserViewRepository from '@infrastructure/view-repository/user-view-repository';
import IUserViewRepository from '@view/view-repository/user-view-repository';

export const UserViewRepositoryProvider = {
  provide: IUserViewRepository,
  useClass: UserViewRepository,
};
