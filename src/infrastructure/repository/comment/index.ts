import {
  getRepository,
  Repository as TypeOrmRepository,
  SelectQueryBuilder,
} from 'typeorm';

import { CommentEntity as DomainCommentEntity } from '@domain/entity/post/comment';
import { ICommentRepository } from '@domain/repository/comment';

import RDBCommentEntity from '@infrastructure/rdb/entity/comment';
import { CommentFactory } from '@infrastructure/factory/comment';
import {
  InfrastructureError,
  InfrastructureErrorCode,
  InfrastructureErrorDetailCode,
} from '@infrastructure/exception';

import Repository from '../base';

const commentFactory = new CommentFactory();

export class CommentRepository
  extends Repository<DomainCommentEntity>
  implements ICommentRepository
{
  async getById(
    transaction: TransactionType,
    id: number,
  ): Promise<DomainCommentEntity> {
    const repository = transaction
      ? transaction.getRepository(RDBCommentEntity)
      : getRepository(RDBCommentEntity);

    const query = this.getBaseQuery(repository).where('comment.id = :id', {
      id,
    });
    const comment = await query.getOne();

    return commentFactory.createCommentEntity(comment);
  }

  async save(
    transaction: TransactionType,
    comment: DomainCommentEntity,
  ): Promise<DomainCommentEntity> {
    const repository = transaction
      ? transaction.getRepository(RDBCommentEntity)
      : getRepository(RDBCommentEntity);

    const createdComment = await repository.save({
      content: comment.content,
      userId: comment.userId,
      postId: comment.postId,
    });

    return commentFactory.createCommentEntity(createdComment);
  }

  async update(
    transaction: TransactionType,
    comment: DomainCommentEntity,
  ): Promise<DomainCommentEntity> {
    const repository = transaction
      ? transaction.getRepository(RDBCommentEntity)
      : getRepository(RDBCommentEntity);

    if (!comment.id) {
      throw new InfrastructureError({
        code: InfrastructureErrorCode.BAD_REQUEST,
        message: 'Must specify comment id',
        info: {
          detailCode: InfrastructureErrorDetailCode.MUST_SPECIFY_COMMENT_ID,
        },
      });
    }

    const commentRDBEntity = await repository.findOne({ id: comment.id });

    if (!commentRDBEntity) {
      throw new InfrastructureError({
        code: InfrastructureErrorCode.NOT_FOUND,
        message: 'Comment does not exist',
        info: {
          detailCode: InfrastructureErrorDetailCode.RDB_COMMENT_NOT_EXIST,
        },
      });
    }

    commentRDBEntity.content = comment.content;

    await repository.save(commentRDBEntity);

    return this.getById(transaction, commentRDBEntity.id);
  }

  async deleteById(transaction: TransactionType, id: number): Promise<void> {
    const repository = transaction
      ? transaction.getRepository(RDBCommentEntity)
      : getRepository(RDBCommentEntity);

    const commentEntity = await this.getById(transaction, id);

    await repository.remove(commentEntity);
  }

  private getBaseQuery(
    repository: TypeOrmRepository<RDBCommentEntity>,
  ): SelectQueryBuilder<RDBCommentEntity> {
    const query = repository
      .createQueryBuilder('comment')
      .select([
        'comment.id',
        'comment.userId',
        'comment.postId',
        'comment.content',
      ]);

    return query;
  }
}
