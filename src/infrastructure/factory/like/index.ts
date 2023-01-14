import { BaseFactory } from '../base';

import { LikeEntity } from '@domain/entity/post/like';
import Like from '@infrastructure/rdb/entity/like';

export interface LikeEntityReconstructParams {
  postId: number;
  userId: number;
}

export class LikeFactory extends BaseFactory {
  createLikeEntity(like: Like | null) {
    if (!like) return null;

    return this.createEntity(LikeEntity, like);
  }

  reconstruct(params: LikeEntityReconstructParams) {
    return this.createEntity(LikeEntity, params);
  }
}
