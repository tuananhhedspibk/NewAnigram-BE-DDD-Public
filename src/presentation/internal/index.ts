import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AuthenticationController } from './authentication/index.controller';
import { NotificationController } from './notification/index.controller';
import { PostController } from './post/index.controller';
import { UserController } from './user/index.controller';

const RequiredAuthenControllers = [
  UserController,
  PostController,
  NotificationController,
];

@Module({
  providers: [],
  controllers: [AuthenticationController, ...RequiredAuthenControllers],
})
export class InternalApiModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply().forRoutes(...RequiredAuthenControllers);
  }
}
