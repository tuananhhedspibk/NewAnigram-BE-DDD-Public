import BaseViewRepository from './base';

import { UserFeedPostDto } from '../dto/user-feed-post-dto';
import { UserProfileDto } from '../dto/user-profile-dto';

import { GetUserFeedOption } from '@infrastructure/view-repository/user-view-repository';

export default abstract class IUserViewRepository extends BaseViewRepository {
  getUserProfileById: (id: number) => Promise<UserProfileDto | null>;
  getUserFeed: (
    userId: number,
    options: GetUserFeedOption,
  ) => Promise<UserFeedPostDto[]>;
}
