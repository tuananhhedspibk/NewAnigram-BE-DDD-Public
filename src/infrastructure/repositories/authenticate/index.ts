import { IAuthenticateRepository } from '@domain/repositories/authenticate';
import RdbUserEntity from '@infrastructure/rdb/entities/user';
import * as jwt from 'jsonwebtoken';
import { getRepository, Repository, SelectQueryBuilder } from 'typeorm';

import { JWT_CONFIG } from '../../constants';

export class AuthenticateRepository implements IAuthenticateRepository {
  async getJWT(userId: number, userName: string): Promise<string> {
    return jwt.sign({ id: userId, name: userName }, JWT_CONFIG.secrete);
  }

  async isEmailBeingUsed(email: string): Promise<boolean> {
    const repository = getRepository(RdbUserEntity);

    const query = this.getBaseQuery(repository);
    const user = await query.where('user.email = :email', { email }).getOne();

    return user !== undefined;
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
