import { Module, NestModule } from '@nestjs/common';
import { FollowController } from './follow.controller';

@Module({
  providers: [],
  controllers: [FollowController],
})
export class FollowModule implements NestModule {}
