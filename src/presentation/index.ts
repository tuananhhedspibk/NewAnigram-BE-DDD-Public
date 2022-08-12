import { Module, NestModule } from '@nestjs/common';
import { InternalApiModule } from './internal';

@Module({
  imports: [InternalApiModule],
})
export class ApiModule implements NestModule {}
