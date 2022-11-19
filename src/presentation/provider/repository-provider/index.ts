import { IAuthenticateRepository } from '@domain/repository/authenticate';
import { AuthenticateRepository } from '@infrastructure/repository/authenticate';
import { IUserRepository } from '@domain/repository/user';
import IImageRepository from '@domain/repository/image';

import { UserRepository } from '@infrastructure/repository/user';
import ITransactionManager from '@domain/repository/transaction';
import TransactionManager from '@infrastructure/repository/transaction';
import ImageRepository from '@infrastructure/repository/image';

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

export const ImageRepositoryProvider = {
  provide: IImageRepository,
  useClass: ImageRepository,
};
