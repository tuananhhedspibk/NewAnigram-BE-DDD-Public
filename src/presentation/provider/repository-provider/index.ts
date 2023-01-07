import { IAuthenticateRepository } from '@domain/repository/authenticate';
import { IUserRepository } from '@domain/repository/user';
import { IPostRepository } from '@domain/repository/post';
import { IImageRepository } from '@domain/repository/image';

import ITransactionManager from '@domain/repository/transaction';

import { UserRepository } from '@infrastructure/repository/user';

import { PostRepository } from '@infrastructure/repository/post';
import TransactionManager from '@infrastructure/repository/transaction';
import ImageRepository from '@infrastructure/repository/image';
import { AuthenticateRepository } from '@infrastructure/repository/authenticate';

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

export const PostRepositoryProvider = {
  provide: IPostRepository,
  useClass: PostRepository,
};
