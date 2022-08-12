import { Module, NestModule } from '@nestjs/common';
import { NotificationController } from './notification.controller';

@Module({
  providers: [],
  controllers: [NotificationController],
})
export class NotificationModule implements NestModule {}
