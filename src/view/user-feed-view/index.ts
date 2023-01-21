/* eslint-disable @typescript-eslint/no-unused-vars */

import { Inject } from '@nestjs/common';

import BaseView from '@view/base';
import { UserFeedPostDto } from '@view/dto/user-feed-post-dto';
import { ViewError, ViewErrorCode, ViewErrorDetailCode } from '@view/exception';
import IUserViewRepository from '@view/view-repository/user-view-repository';

export class UserFeedViewOutput {
  data: UserFeedPostDto[];
}

export default class UserFeedView extends BaseView {
  constructor(
    @Inject(IUserViewRepository)
    private readonly userViewRepository: IUserViewRepository,
  ) {
    super();
  }

  async getUserFeed(userId: number, page: number): Promise<UserFeedViewOutput> {
    const userProfile = await this.userViewRepository.getUserProfileById(
      userId,
    );

    if (!userProfile) {
      throw new ViewError({
        code: ViewErrorCode.NOT_FOUND,
        message: 'User does not exist',
        info: {
          detailCode: ViewErrorDetailCode.USER_NOT_EXIST,
        },
      });
    }

    const feed = await this.userViewRepository.getUserFeed(userId, {
      page,
    });

    return { data: feed };
  }
}
