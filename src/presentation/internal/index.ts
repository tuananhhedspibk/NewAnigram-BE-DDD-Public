/* eslint-disable @typescript-eslint/no-unused-vars */

import {
  MiddlewareConsumer,
  Module,
  NestModule,
  Provider,
} from '@nestjs/common';
import SigninUsecase from '@usecase/authentication/signin';
import SignupUsecase from '@usecase/authentication/signup';
import {
  AuthenticateRepositoryProvider,
  TransactionManagerProvider,
  UserRepositoryProvider,
} from '@presentation/provider/repository-provider';
import { AuthenticationController } from '@presentation/internal/authentication/index.controller';
import { NotificationController } from '@presentation/internal/notification/index.controller';
import { PostController } from '@presentation/internal/post/index.controller';
import { UserController } from '@presentation/internal/user/index.controller';
import { AuthMiddleware } from '@presentation/middleware/auth-middleware';
import CheckPasswordUsecase from '@usecase/user/check-password';

const RepositoryProviders: Provider[] = [
  AuthenticateRepositoryProvider,
  UserRepositoryProvider,
  TransactionManagerProvider,
];

@Module({
  providers: [...RepositoryProviders],
  exports: [...RepositoryProviders],
})
class Repositories {}

const RequiredAuthenControllers = [
  UserController,
  PostController,
  NotificationController,
];

@Module({
  imports: [Repositories],
  providers: [SigninUsecase, SignupUsecase, CheckPasswordUsecase],
  controllers: [AuthenticationController, ...RequiredAuthenControllers],
})
export class InternalApiModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes(...RequiredAuthenControllers);
  }
}
