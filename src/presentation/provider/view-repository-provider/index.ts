import IPostViewRepository from '@view/view-repository/post-view-repository';
import IUserViewRepository from '@view/view-repository/user-view-repository';

import PostViewRepository from '@infrastructure/view-repository/post-view-repository';
import UserViewRepository from '@infrastructure/view-repository/user-view-repository';

export const UserViewRepositoryProvider = {
  provide: IUserViewRepository,
  useClass: UserViewRepository,
};

export const PostViewRepositoryProvider = {
  provide: IPostViewRepository,
  useClass: PostViewRepository,
};
