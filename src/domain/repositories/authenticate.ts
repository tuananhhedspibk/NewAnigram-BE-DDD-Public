import { BaseRepository } from '@domain/repositories/base';

export abstract class IAuthenticateRepository extends BaseRepository {
  getJWT: (userId: number, userName: string) => Promise<string>;
  isEmailBeingUsed: (email: string) => Promise<boolean>;
  validate: (email: string, password: string) => Promise<boolean>;
}
