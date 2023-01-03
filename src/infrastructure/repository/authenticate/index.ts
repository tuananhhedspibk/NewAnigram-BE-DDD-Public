import { getRepository, Repository, SelectQueryBuilder } from 'typeorm';

import { IAuthenticateRepository } from '@domain/repository/authenticate';
import RdbUserEntity from '@infrastructure/rdb/entity/user';
import { hashPassword, generateJWT } from '@utils/encrypt';

export class AuthenticateRepository implements IAuthenticateRepository {
  getJWT(userId: number, email: string): string {
    return generateJWT(userId, email);
  }

  async isEmailBeingUsed(email: string): Promise<boolean> {
    const repository = getRepository(RdbUserEntity);

    const query = this.getBaseQuery(repository);
    const user = await query.where('user.email = :email', { email }).getOne();

    return user !== undefined;
  }

  async validatePassword(email: string, password: string): Promise<boolean> {
    const repository = getRepository(RdbUserEntity);

    const query = this.getBaseQuery(repository);
    const user = await query
      .where('user.email = :email', { email })
      .addSelect('user.password')
      .addSelect('user.salt')
      .getOne();

    const hashedPassword = hashPassword(password, user.salt);

    return user.password === hashedPassword;
  }

  private getBaseQuery(
    repository: Repository<RdbUserEntity>,
  ): SelectQueryBuilder<RdbUserEntity> {
    const query = repository
      .createQueryBuilder('user')
      .select(['user.id', 'user.email']);

    return query;
  }
}
