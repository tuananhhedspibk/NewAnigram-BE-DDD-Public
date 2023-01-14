import { BaseRepository } from './base';

import { LikeEntity } from '@domain/entity/post/like';

export abstract class ILikeRepository extends BaseRepository {
  getByPostAndUserId: (
    transaction: TransactionType | null,
    postId: number,
    userId: number,
  ) => Promise<LikeEntity>;
  save: (
    transaction: TransactionType,
    likeEntity: LikeEntity,
  ) => Promise<LikeEntity>;
  deleteById: (transaction: TransactionType, id: number) => Promise<void>;
}
