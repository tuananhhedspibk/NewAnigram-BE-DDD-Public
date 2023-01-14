/* eslint-disable @typescript-eslint/no-unused-vars */

import {
  MiddlewareConsumer,
  Module,
  NestModule,
  Provider,
} from '@nestjs/common';

import SigninUsecase from '@usecase/authentication/signin';
import SignupUsecase from '@usecase/authentication/signup';
import UpdateUserProfileUsecase from '@usecase/user/update-profile';
import CreatePostUsecase from '@usecase/post/create';
import UpdatePostUsecase from '@usecase/post/update';
import DeletePostUsecase from '@usecase/post/delete';
import UpdatePasswordUsecase from '@usecase/user/update-password';

import {
  AuthenticateRepositoryProvider,
  ImageRepositoryProvider,
  TransactionManagerProvider,
  UserRepositoryProvider,
  PostRepositoryProvider,
  FollowRepositoryProvider,
  LikeRepositoryProvider,
  CommentRepositoryProvider,
} from '@presentation/provider/repository-provider';
import { UserViewRepositoryProvider } from '@presentation/provider/view-repository-provider';

import { AuthenticationController } from '@presentation/internal/authentication/index.controller';
import { NotificationController } from '@presentation/internal/notification/index.controller';
import { PostController } from '@presentation/internal/post/index.controller';
import { UserController } from '@presentation/internal/user/index.controller';

import { AuthMiddleware } from '@presentation/middleware/auth-middleware';

import UserProfileView from '@view/user-profile-view';

import FollowUserUsecase from '@usecase/user/follow';
import UnfollowUserUsecase from '@usecase/user/unfollow';
import LikePostUsecase from '@usecase/post/like';
import UnlikePostUsecase from '@usecase/post/unlike';
import CommentPostUsecase from '@usecase/post/comment';

const RepositoryProviders: Provider[] = [
  AuthenticateRepositoryProvider,
  UserRepositoryProvider,
  TransactionManagerProvider,
  ImageRepositoryProvider,
  PostRepositoryProvider,
  FollowRepositoryProvider,
  LikeRepositoryProvider,
  CommentRepositoryProvider,
];

const ViewRepositoryProvider: Provider[] = [UserViewRepositoryProvider];

@Module({
  providers: [...RepositoryProviders],
  exports: [...RepositoryProviders],
})
class Repositories {}

@Module({
  providers: [...ViewRepositoryProvider],
  exports: [...ViewRepositoryProvider],
})
class ViewRepositories {}

const RequiredAuthenControllers = [
  UserController,
  PostController,
  NotificationController,
];

@Module({
  imports: [Repositories, ViewRepositories],
  providers: [
    SigninUsecase,
    SignupUsecase,
    UpdatePasswordUsecase,
    UpdateUserProfileUsecase,
    FollowUserUsecase,
    UnfollowUserUsecase,
    CreatePostUsecase,
    UpdatePostUsecase,
    DeletePostUsecase,
    LikePostUsecase,
    UnlikePostUsecase,
    CommentPostUsecase,
    UserProfileView,
  ],
  controllers: [AuthenticationController, ...RequiredAuthenControllers],
})
export class InternalApiModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes(...RequiredAuthenControllers);
  }
}
