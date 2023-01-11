import { FollowEntity } from '@domain/entity/follow';
import { BaseRepository } from './base';

export abstract class IFollowRepository extends BaseRepository {
  getById: (
    transaction: TransactionType,
    id: number,
  ) => Promise<FollowEntity | null>;
  getByUserIds: (
    transaction: TransactionType,
    sourceUserId: number,
    destinationUserId: number,
  ) => Promise<FollowEntity>;
  save: (
    transaction: TransactionType,
    follow: FollowEntity,
  ) => Promise<FollowEntity>;
  deleteById: (transaction: TransactionType, id: number) => Promise<void>;
}
