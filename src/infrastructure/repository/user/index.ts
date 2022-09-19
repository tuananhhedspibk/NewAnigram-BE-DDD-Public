import {
  getRepository,
  Repository as TypeOrmRepository,
  SelectQueryBuilder,
} from 'typeorm';

import {
  UserEntity as DomainUserEntity,
  UserEntity,
} from '@domain/entity/user';
import { IUserRepository } from '@domain/repository/user';
import RdbUserEntity from '@infrastructure/rdb/entity/user';
import { Transaction } from '@infrastructure/repository/transaction';
import Repository from '@infrastructure/repository/base';
import { UserFactory } from '@infrastructure/factory/user';
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
      ? transaction.getRepository(RdbUserEntity)
      : getRepository(RdbUserEntity);

    const query = this.getBaseQuery(repository);
    const user = await query.where('user.email = :email', { email }).getOne();

    return userFactory.createUserEntity(user);
  }

  async save(
    transaction: TransactionType,
    user: UserEntity,
  ): Promise<UserEntity> {
    const repository = transaction
      ? transaction.getRepository(RdbUserEntity)
      : getRepository(RdbUserEntity);

    const salt = randomlyGenerateSalt();
    const passwordHashedWithSalt = hashPassword(user.password, salt);

    const createdUser = await repository.save({
      email: user.email.toString(),
      password: passwordHashedWithSalt,
      userName: user.userName,
      salt,
    });

    return userFactory.createUserEntity(createdUser);
  }

  private getBaseQuery(
    repository: TypeOrmRepository<RdbUserEntity>,
  ): SelectQueryBuilder<RdbUserEntity> {
    const query = repository
      .createQueryBuilder('user')
      .select(['user.id', 'user.email', 'user.userName']);

    return query;
  }
}
