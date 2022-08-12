import { Module, NestModule } from '@nestjs/common';
import { NotificationModule } from './notification';
import { PostModule } from './post';
import { UserModule } from './user';

@Module({
  providers: [],
  controllers: [],
  imports: [UserModule, PostModule, NotificationModule],
})
export class InternalApiModule implements NestModule {}
