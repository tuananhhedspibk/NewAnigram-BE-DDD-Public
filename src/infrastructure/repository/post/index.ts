import {
  getRepository,
  Repository as TypeOrmRepository,
  SelectQueryBuilder,
} from 'typeorm';

import { IPostRepository } from '@domain/repository/post';
import Repository from '@infrastructure/repository/base';
import RDBPostEntity from '@infrastructure/rdb/entity/post';

import { PostEntity as DomainPostEntity } from '@domain/entity/post';
import { PostFactory } from '@infrastructure/factory/post';
import {
  InfrastructureError,
  InfrastructureErrorCode,
  InfrastructureErrorDetailCode,
} from '@infrastructure/exception';

const postFactory = new PostFactory();

export class PostRepository
  extends Repository<DomainPostEntity>
  implements IPostRepository
{
  async getById(
    transaction: TransactionType,
    id: number,
  ): Promise<DomainPostEntity | null> {
    const repository = transaction
      ? transaction.getRepository(RDBPostEntity)
      : getRepository(RDBPostEntity);

    const query = this.getBaseQuery(repository).where('post.id = :id', { id });
    const post = await query.getOne();

    return postFactory.createPostEntity(post);
  }

  async save(
    transaction: TransactionType,
    post: DomainPostEntity,
  ): Promise<DomainPostEntity> {
    const repository = transaction
      ? transaction.getRepository(RDBPostEntity)
      : getRepository(RDBPostEntity);

    const createdPost = await repository.save({
      content: post.content,
      images: { list: post.images },
      tags: { list: post.tags },
      userId: post.userId,
    });

    return this.getById(transaction, createdPost.id);
  }

  async update(
    transaction: TransactionType,
    post: DomainPostEntity,
  ): Promise<DomainPostEntity> {
    const repository = transaction
      ? transaction.getRepository(RDBPostEntity)
      : getRepository(RDBPostEntity);

    if (!post.id) {
      throw new InfrastructureError({
        code: InfrastructureErrorCode.BAD_REQUEST,
        message: 'Must specify post id',
        info: {
          detailCode: InfrastructureErrorDetailCode.MUST_SPECIFY_POST_ID,
        },
      });
    }

    const postRDBEntity = await repository.findOne({ where: { id: post.id } });

    if (!postRDBEntity) {
      throw new InfrastructureError({
        code: InfrastructureErrorCode.NOT_FOUND,
        message: 'Post does not exist',
        info: {
          detailCode: InfrastructureErrorDetailCode.RDB_POST_NOT_EXIST,
        },
      });
    }

    postRDBEntity.content = post.content;
    postRDBEntity.images = { list: post.images };
    postRDBEntity.tags = { list: post.tags };

    await repository.save(postRDBEntity);

    return this.getById(transaction, postRDBEntity.id);
  }

  private getBaseQuery(
    repository: TypeOrmRepository<RDBPostEntity>,
  ): SelectQueryBuilder<RDBPostEntity> {
    const query = repository
      .createQueryBuilder('post')
      .select([
        'post.id',
        'post.images',
        'post.tags',
        'post.content',
        'post.createdAt',
        'user.id',
      ])
      .innerJoin('post.user', 'user');

    return query;
  }
}
