import { Module, NestModule } from '@nestjs/common';
import { FollowModule } from './follow';
import { NotificationModule } from './notification';
import { PostModule } from './post';
import { UserModule } from './user';

@Module({
  providers: [],
  controllers: [],
  imports: [UserModule, PostModule, NotificationModule, FollowModule],
})
export class InternalApiModule implements NestModule {}
