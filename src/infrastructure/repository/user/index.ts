import {
  getRepository,
  Repository as TypeOrmRepository,
  SelectQueryBuilder,
} from 'typeorm';

import { UserEntity as DomainUserEntity } from '@domain/entity/user';
import { IUserRepository } from '@domain/repository/user';
import { UserDetailGender } from '@domain/entity/user/user-detail';

import RDBUserEntity from '@infrastructure/rdb/entity/user';
import RDBUserDetail from '@infrastructure/rdb/entity/user-detail';

import { Transaction } from '@infrastructure/repository/transaction';
import Repository from '@infrastructure/repository/base';
import { UserFactory } from '@infrastructure/factory/user';
import {
  InfrastructureError,
  InfrastructureErrorCode,
  InfrastructureErrorDetailCode,
} from '@infrastructure/exception';

import { hashPassword, randomlyGenerateSalt } from '@utils/encrypt';

const userFactory = new UserFactory();

export class UserRepository
  extends Repository<DomainUserEntity>
  implements IUserRepository
{
  async getByEmail(
    transaction: Transaction | null,
    email: string,
  ): Promise<DomainUserEntity> {
    const repository = transaction
      ? transaction.getRepository(RDBUserEntity)
      : getRepository(RDBUserEntity);

    const query = this.getBaseQuery(repository);
    const user = await query.where('user.email = :email', { email }).getOne();

    return userFactory.createUserEntity(user);
  }

  async getByIds(
    transaction: Transaction | null,
    ids: number[],
  ): Promise<DomainUserEntity[]> {
    const repository = transaction
      ? transaction.getRepository(RDBUserEntity)
      : getRepository(RDBUserEntity);

    const query = this.getBaseQuery(repository);
    const users = await query.where('user.id IN (:ids)', { ids }).getMany();

    return userFactory.createUserEntities(users);
  }

  async save(
    transaction: TransactionType,
    user: DomainUserEntity,
  ): Promise<DomainUserEntity> {
    const repository = transaction
      ? transaction.getRepository(RDBUserEntity)
      : getRepository(RDBUserEntity);

    const salt = randomlyGenerateSalt();
    const passwordHashedWithSalt = hashPassword(user.password.toString(), salt);

    const createdUser = await repository.save({
      email: user.email.toString(),
      password: passwordHashedWithSalt,
      userName: user.userName,
      salt,
    });

    return userFactory.createUserEntity(createdUser);
  }

  async getById(
    transaction: TransactionType,
    id: number,
  ): Promise<DomainUserEntity> {
    const repository = transaction
      ? transaction.getRepository(RDBUserEntity)
      : getRepository(RDBUserEntity);

    const query = this.getBaseQuery(repository).where('user.id = :id', { id });
    const user = await query.getOne();

    return userFactory.createUserEntity(user);
  }

  async update(
    transaction: TransactionType,
    user: DomainUserEntity,
  ): Promise<DomainUserEntity> {
    const repository = transaction
      ? transaction.getRepository(RDBUserEntity)
      : getRepository(RDBUserEntity);

    if (!user.id) {
      throw new InfrastructureError({
        code: InfrastructureErrorCode.BAD_REQUEST,
        message: 'Must specify user id',
        info: {
          detailCode: InfrastructureErrorDetailCode.MUST_SPECIFY_USER_ID,
        },
      });
    }

    const userRDBEntity = await repository.findOne({ where: { id: user.id } });

    if (!userRDBEntity) {
      throw new InfrastructureError({
        code: InfrastructureErrorCode.NOT_FOUND,
        message: 'User does not exist',
        info: {
          detailCode: InfrastructureErrorDetailCode.RDB_USER_NOT_EXIST,
        },
      });
    }

    userRDBEntity.email = user.email.toString();
    userRDBEntity.userName = user.userName;

    if (user.password) {
      userRDBEntity.password = hashPassword(
        user.password.toString(),
        userRDBEntity.salt,
      );
    }

    await repository.save(userRDBEntity);

    if (user.detail) {
      await this.updateUserDetail(transaction, user);
    }

    return this.getById(transaction, userRDBEntity.id);
  }

  private async updateUserDetail(
    transaction: TransactionType,
    user: DomainUserEntity,
  ) {
    const repository = transaction
      ? transaction.getRepository(RDBUserDetail)
      : getRepository(RDBUserDetail);

    let userDetailRDBEntity: RDBUserDetail;

    if (user.detail.id) {
      userDetailRDBEntity = await repository.findOne({
        where: { id: user.detail.id },
      });
    } else {
      userDetailRDBEntity = new RDBUserDetail();
      userDetailRDBEntity.userId = user.id;
    }

    userDetailRDBEntity.gender = user.detail.gender || UserDetailGender.Male;
    userDetailRDBEntity.avatarURL = user.detail.avatarURL || '';
    userDetailRDBEntity.nickName = user.detail.nickName || '';

    await repository.save(userDetailRDBEntity);
  }

  private getBaseQuery(
    repository: TypeOrmRepository<RDBUserEntity>,
  ): SelectQueryBuilder<RDBUserEntity> {
    const query = repository
      .createQueryBuilder('user')
      .select([
        'user.id',
        'user.email',
        'user.userName',
        'userDetail.id',
        'userDetail.nickName',
        'userDetail.avatarURL',
        'userDetail.gender',
      ])
      .leftJoin('user.userDetail', 'userDetail');

    return query;
  }
}
