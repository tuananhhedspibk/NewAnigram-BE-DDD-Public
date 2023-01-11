import { IFollowRepository } from '@domain/repository/follow';
import { FollowEntity as DomainFollowEntity } from '@domain/entity/follow';
import RDBFollowEntity from '@infrastructure/rdb/entity/follow';
import Repository from '../base';
import {
  getRepository,
  Repository as TypeOrmRepository,
  SelectQueryBuilder,
} from 'typeorm';
import { FollowFactory } from '@infrastructure/factory/follow';

const followFactory = new FollowFactory();

export class FollowRepository
  extends Repository<DomainFollowEntity>
  implements IFollowRepository
{
  async getById(
    transaction: TransactionType,
    id: number,
  ): Promise<DomainFollowEntity | null> {
    const repository = transaction
      ? transaction.getRepository(RDBFollowEntity)
      : getRepository(RDBFollowEntity);

    const query = this.getBaseQuery(repository);
    const follow = await query.where('follow.id = :id', { id }).getOne();

    if (!follow) return null;

    return followFactory.createFollowEntity(follow);
  }

  async getByUserIds(
    transaction: TransactionType,
    sourceUserId: number,
    destinationUserId: number,
  ): Promise<DomainFollowEntity> {
    const repository = transaction
      ? transaction.getRepository(RDBFollowEntity)
      : getRepository(RDBFollowEntity);

    const query = this.getBaseQuery(repository)
      .where('follow.sourceUserId = :sourceUserId', { sourceUserId })
      .andWhere('follow.destinationUserId = :destinationUserId', {
        destinationUserId,
      });

    const follow = await query.getOne();

    if (!follow) return null;

    return followFactory.createFollowEntity(follow);
  }

  async save(
    transaction: TransactionType,
    follow: DomainFollowEntity,
  ): Promise<DomainFollowEntity> {
    const repository = transaction
      ? transaction.getRepository(RDBFollowEntity)
      : getRepository(RDBFollowEntity);

    const createdFollow = repository.save({
      sourceUserId: follow.sourceUserId,
      destinationUserId: follow.destinationUserId,
    });

    return followFactory.createFollowEntity(createdFollow);
  }

  async deleteById(transaction: TransactionType, id: number): Promise<void> {
    const repository = transaction
      ? transaction.getRepository(RDBFollowEntity)
      : getRepository(RDBFollowEntity);

    const followEntity = await this.getById(transaction, id);

    await repository.remove(followEntity);
  }

  private getBaseQuery(
    repository: TypeOrmRepository<RDBFollowEntity>,
  ): SelectQueryBuilder<RDBFollowEntity> {
    const query = repository
      .createQueryBuilder('follow')
      .select(['follow.id', 'follow.sourceUserId', 'follow.destinationUserId']);

    return query;
  }
}
