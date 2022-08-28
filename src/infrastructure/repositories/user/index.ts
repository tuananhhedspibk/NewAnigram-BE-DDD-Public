import {
  getRepository,
  Repository as TypeOrmRepository,
  SelectQueryBuilder,
} from 'typeorm';

import { UserEntity as DomainUserEntity } from '@domain/entities/user';
import { IUserRepository } from '@domain/repositories/user';
import RdbUserEntity from '@infrastructure/rdb/entities/user';
import { Transaction } from '@infrastructure/repositories/transaction';
import Repository from '@infrastructure/repositories/base';
import { UserFactory } from '@infrastructure/factories/user';
import { hashPassword } from '@utils/hash';

const userFactory = new UserFactory();

export class UserRepository
  extends Repository<DomainUserEntity>
  implements IUserRepository
{
  async getByEmail(
    transaction: Transaction | null,
    email: string,
  ): Promise<DomainUserEntity> {
    const userRepository = transaction
      ? transaction.getRepository(RdbUserEntity)
      : getRepository(RdbUserEntity);

    const query = this.getBaseQuery(userRepository);
    const user = await query.where('user.email = :email', { email }).getOne();

    return userFactory.createUserEntity(user);
  }

  async validate(email: string, password: string): Promise<boolean> {
    const userRepository = getRepository(RdbUserEntity);

    const query = this.getBaseQuery(userRepository);
    const user = await query
      .where('user.email = :email', { email })
      .addSelect('user.password')
      .addSelect('user.salt')
      .getOne();

    const hashedPassword = await hashPassword(password, user.salt);

    return user.password === hashedPassword;
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
