/* eslint-disable @typescript-eslint/no-unused-vars */

import { Inject, Injectable } from '@nestjs/common';
import BaseView from '../base';
import IUserViewRepository from '../view-repository/user-view-repository';

@Injectable()
export default class UserProfileView extends BaseView {
  constructor(
    @Inject(IUserViewRepository)
    private readonly userViewRepository: IUserViewRepository,
  ) {
    super();
  }

  async getUserProfile(userId: number) {
    return this.userViewRepository.getUserProfileById(userId);
  }
}
