import {
  getRepository,
  Repository as TypeOrmRepository,
  SelectQueryBuilder,
} from 'typeorm';

import Repository from '../base';

import { LikeEntity as DomainLikeEntity } from '@domain/entity/post/like';
import { ILikeRepository } from '@domain/repository/like';
import RDBLikeEntity from '@infrastructure/rdb/entity/like';
import { LikeFactory } from '@infrastructure/factory/like';

const likeFactory = new LikeFactory();

export class LikeRepository
  extends Repository<DomainLikeEntity>
  implements ILikeRepository
{
  async getByPostAndUserId(
    transaction: TransactionType | null,
    postId: number,
    userId: number,
  ): Promise<DomainLikeEntity> {
    const repository = transaction
      ? transaction.getRepository(RDBLikeEntity)
      : getRepository(RDBLikeEntity);

    const query = this.getBaseQuery(repository);
    const like = await query
      .where('like.postId = :postId AND like.userId = :userId', {
        postId,
        userId,
      })
      .getOne();

    return likeFactory.createLikeEntity(like);
  }

  async getById(
    transaction: TransactionType,
    id: number,
  ): Promise<DomainLikeEntity> {
    const repository = transaction
      ? transaction.getRepository(RDBLikeEntity)
      : getRepository(RDBLikeEntity);

    const query = this.getBaseQuery(repository);
    const like = await query.where('id = :id', { id }).getOne();

    return likeFactory.createLikeEntity(like);
  }

  async save(
    transaction: TransactionType,
    likeEntity: DomainLikeEntity,
  ): Promise<DomainLikeEntity> {
    const repository = transaction
      ? transaction.getRepository(RDBLikeEntity)
      : getRepository(RDBLikeEntity);

    const createdLike = await repository.save({
      postId: likeEntity.postId,
      userId: likeEntity.userId,
    });

    return likeFactory.createLikeEntity(createdLike);
  }

  async deleteById(transaction: TransactionType, id: number): Promise<void> {
    const repository = transaction
      ? transaction.getRepository(RDBLikeEntity)
      : getRepository(RDBLikeEntity);

    const likeEntity = await this.getById(transaction, id);

    await repository.remove(likeEntity);
  }

  private getBaseQuery(
    repository: TypeOrmRepository<RDBLikeEntity>,
  ): SelectQueryBuilder<RDBLikeEntity> {
    const query = repository
      .createQueryBuilder('like')
      .select(['like.id', 'like.postId', 'like.userId']);

    return query;
  }
}
