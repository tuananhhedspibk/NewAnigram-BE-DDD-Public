import { UserEntity } from '../entities/user';
import { BaseRepository } from './base';

export abstract class IUserRepository extends BaseRepository {
  getByEmail: (
    transaction: TransactionType | null,
    email: string,
  ) => Promise<UserEntity | null>;
  validate: (email: string, password: string) => Promise<boolean>;
}
