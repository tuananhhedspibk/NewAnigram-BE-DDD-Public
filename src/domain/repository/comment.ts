import { CommentEntity } from '@domain/entity/post/comment';
import { BaseRepository } from './base';

export abstract class ICommentRepository extends BaseRepository {
  getById: (
    transaction: TransactionType,
    id: number,
  ) => Promise<CommentEntity | null>;
  save: (
    transaction: TransactionType,
    comment: CommentEntity,
  ) => Promise<CommentEntity>;
  update: (
    transaction: TransactionType,
    comment: CommentEntity,
  ) => Promise<CommentEntity>;
  deleteById: (transaction: TransactionType, id: number) => Promise<void>;
}
