import { IAuthenticateRepository } from '@domain/repositories/authenticate';
import { AuthenticateRepository } from '@infrastructure/repositories/authenticate';
import { IUserRepository } from '@domain/repositories/user';
import { UserRepository } from '@infrastructure/repositories/user';
import ITransactionManager from '@domain/repositories/transaction';
import TransactionManager from '@infrastructure/repositories/transaction';

export const UserRepositoryProvider = {
  provide: IUserRepository,
  useClass: UserRepository,
};

export const AuthenticateRepositoryProvider = {
  provide: IAuthenticateRepository,
  useClass: AuthenticateRepository,
};

export const TransactionManagerProvider = {
  provide: ITransactionManager,
  useClass: TransactionManager,
};
