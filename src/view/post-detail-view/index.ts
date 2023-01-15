/* eslint-disable @typescript-eslint/no-unused-vars */

import { Inject, Injectable } from '@nestjs/common';
import BaseView from '@view/base';
import IPostViewRepository from '@view/view-repository/post-view-repository';

@Injectable()
export default class PostDetailView extends BaseView {
  constructor(
    @Inject(IPostViewRepository)
    private readonly postViewRepository: IPostViewRepository,
  ) {
    super();
  }

  async getPostDetail(id: number) {
    return this.postViewRepository.getPostDetail(id);
  }
}
