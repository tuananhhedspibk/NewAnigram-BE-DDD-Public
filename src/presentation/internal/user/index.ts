import { Module, NestModule } from '@nestjs/common';
import { UserController } from './user.controller';

@Module({
  providers: [],
  controllers: [UserController],
})
export class UserModule implements NestModule {}
