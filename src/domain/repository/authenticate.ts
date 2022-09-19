import { BaseRepository } from '@domain/repository/base';

export abstract class IAuthenticateRepository extends BaseRepository {
  getJWT: (userId: number, email: string) => string;
  isEmailBeingUsed: (email: string) => Promise<boolean>;
  validate: (email: string, password: string) => Promise<boolean>;
}
