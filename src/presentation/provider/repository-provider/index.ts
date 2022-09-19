import { IAuthenticateRepository } from '@domain/repository/authenticate';
import { AuthenticateRepository } from '@infrastructure/repository/authenticate';
import { IUserRepository } from '@domain/repository/user';
import { UserRepository } from '@infrastructure/repository/user';
import ITransactionManager from '@domain/repository/transaction';
import TransactionManager from '@infrastructure/repository/transaction';

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
