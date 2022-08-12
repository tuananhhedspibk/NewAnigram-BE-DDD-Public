import { Module, NestModule } from '@nestjs/common';
import { PostController } from './post.controller';

@Module({
  providers: [],
  controllers: [PostController],
})
export class PostModule implements NestModule {}
