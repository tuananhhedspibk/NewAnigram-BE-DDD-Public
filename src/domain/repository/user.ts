import { UserEntity } from '../entity/user';
import { BaseRepository } from './base';

export abstract class IUserRepository extends BaseRepository {
  getByEmail: (
    transaction: TransactionType | null,
    email: string,
  ) => Promise<UserEntity | null>;
  getById: (
    transaction: TransactionType | null,
    id: number,
  ) => Promise<UserEntity | null>;
  save: (transaction: TransactionType, user: UserEntity) => Promise<UserEntity>;
  update: (
    transaction: TransactionType,
    user: UserEntity,
  ) => Promise<UserEntity>;
}
