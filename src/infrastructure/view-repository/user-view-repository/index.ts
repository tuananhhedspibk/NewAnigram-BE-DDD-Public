import {
  SelectQueryBuilder,
  Repository as TypeOrmRepository,
  getRepository,
} from 'typeorm';

import { UserProfileDto } from '@view/dto/user-profile-dto';
import IUserViewRepository from '@view/view-repository/user-view-repository';
import { UserFeedPostDto } from '@view/dto/user-feed-post-dto';

import RDBUserEntity from '@infrastructure/rdb/entity/user';
import RDBPostEntity from '@infrastructure/rdb/entity/post';

import UserViewFactory, {
  CreateUserFeedPostDtoParams,
} from '@infrastructure/view-factory/user';

const userViewFactory = new UserViewFactory();

const USER_FEED_LIMIT = 9;

export interface GetUserFeedOption {
  limit?: number;
  page: number;
  orderBy?: OrderBy;
}

export default class UserViewRepository implements IUserViewRepository {
  async getUserProfileById(id: number): Promise<UserProfileDto | null> {
    const repository = getRepository(RDBUserEntity);

    const query = this.getBaseQueryForGettingUserProfile(repository);
    const user = await query.where('user.id = :id', { id }).getOne();

    return user ? userViewFactory.createUserProfileDto(user) : null;
  }

  async getUserFeed(
    userId: number,
    options: GetUserFeedOption,
  ): Promise<UserFeedPostDto[]> {
    const limit = options.limit || USER_FEED_LIMIT;
    const offset = options.page ? (options.page - 1) * limit : 0;
    const orderBy = options.orderBy || 'DESC';

    const userRDBRepository = getRepository(RDBUserEntity);
    const postRDBRepository = getRepository(RDBPostEntity);

    const getFollowingUsersQuery =
      this.getBaseQueryForGettingFollowingUser(userRDBRepository);

    const result = await getFollowingUsersQuery
      .where('user.id = :userId', { userId })
      .getMany();

    const followingUserIds = [];

    result.forEach((res) => {
      res.followers.forEach((follower) => {
        followingUserIds.push(follower.destinationUser.id);
      });
    });

    followingUserIds.push(userId);

    const getUserFeedQuery =
      this.getBaseQueryForGettingUserFeed(postRDBRepository);

    const userFeed = await getUserFeedQuery
      .where('post.userId IN (:...userIds)', {
        userIds: followingUserIds,
      })
      .orderBy('post.createdAt', orderBy)
      .take(options.limit || USER_FEED_LIMIT)
      .skip(offset)
      .getMany();

    return userFeed.length > 0
      ? userViewFactory.createUserFeedPostDtoList(
          userFeed as unknown as CreateUserFeedPostDtoParams[],
        )
      : [];
  }

  private getBaseQueryForGettingUserProfile(
    repository: TypeOrmRepository<RDBUserEntity>,
  ): SelectQueryBuilder<RDBUserEntity> {
    const query = repository
      .createQueryBuilder('user')
      .select([
        'user.email',
        'user.userName',
        'userDetail.nickName',
        'userDetail.avatarURL',
        'userDetail.gender',
      ])
      .leftJoin('user.userDetail', 'userDetail');

    return query;
  }

  private getBaseQueryForGettingFollowingUser(
    repository: TypeOrmRepository<RDBUserEntity>,
  ): SelectQueryBuilder<RDBUserEntity> {
    const query = repository
      .createQueryBuilder('user')
      .select(['user.id', 'following.id', 'followingUser.id'])
      .leftJoin('user.followers', 'following')
      .leftJoin('following.destinationUser', 'followingUser');

    return query;
  }

  private getBaseQueryForGettingUserFeed(
    repository: TypeOrmRepository<RDBPostEntity>,
  ): SelectQueryBuilder<RDBPostEntity> {
    const query = repository
      .createQueryBuilder('post')
      .select([
        'post.id',
        'post.content',
        'post.tags',
        'post.images',
        'post.createdAt',
        'user.id',
        'user.userName',
        'userDetail.id',
        'userDetail.avatarURL',
        'postLikes.id',
        'postComments.id',
        'postComments.content',
        'postComments.createdAt',
        'postCommentUser.id',
        'postCommentUser.userName',
        'postCommentUserDetail.avatarURL',
      ])
      .leftJoin('post.likes', 'postLikes')
      .leftJoin('post.comments', 'postComments')
      .leftJoin('post.user', 'user')
      .leftJoin('user.userDetail', 'userDetail')
      .leftJoin('postComments.user', 'postCommentUser')
      .leftJoin('postCommentUser.userDetail', 'postCommentUserDetail');

    return query;
  }
}
