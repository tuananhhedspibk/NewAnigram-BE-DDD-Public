import { Module } from '@nestjs/common';
import { InternalApiModule } from './internal';

@Module({
  imports: [InternalApiModule],
})
export class ApiModule {}
