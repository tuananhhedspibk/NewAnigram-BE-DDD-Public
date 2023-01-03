import { BaseRepository } from './base';
import { PostEntity } from '../entity/post';

export abstract class IPostRepository extends BaseRepository {
  save: (transaction: TransactionType, post: PostEntity) => Promise<PostEntity>;
}
