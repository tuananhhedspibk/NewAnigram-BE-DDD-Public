/* eslint-disable @typescript-eslint/no-unused-vars */

import { Inject, Injectable } from '@nestjs/common';
import { UserPostDto } from '@view/dto/user-post-dto';
import { ViewError, ViewErrorCode, ViewErrorDetailCode } from '@view/exception';
import IPostViewRepository from '@view/view-repository/post-view-repository';
import IUserViewRepository from '@view/view-repository/user-view-repository';
import BaseView from '../base';

export class UserPostsViewOutput {
  data: UserPostDto[];
}

@Injectable()
export default class UserPostsView extends BaseView {
  constructor(
    @Inject(IPostViewRepository)
    private readonly postViewRepository: IPostViewRepository,
    @Inject(IUserViewRepository)
    private readonly userViewRepository: IUserViewRepository,
  ) {
    super();
  }

  async getUserPosts(userId: number): Promise<UserPostsViewOutput> {
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

    const posts = await this.postViewRepository.getUserPosts(userId);

    return { data: posts };
  }
}
