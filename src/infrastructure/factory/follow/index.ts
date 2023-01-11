import { FollowEntity } from '@domain/entity/follow';
import Follow from '@infrastructure/rdb/entity/follow';
import { BaseFactory } from '../base';

interface ReconstructFollowParams {
  sourceUserId: number;
  destinationUserId: number;
}

export class FollowFactory extends BaseFactory {
  createFollowEntity(follow: Follow) {
    return this.createEntity(FollowEntity, follow);
  }

  createFollowEntities(follows: Follow[]) {
    return follows.map((follow) => this.createFollowEntity(follow));
  }

  reconstruct(params: ReconstructFollowParams) {
    return this.createEntity(FollowEntity, {
      sourceUserId: params.sourceUserId,
      destinationUserId: params.destinationUserId,
    });
  }
}
