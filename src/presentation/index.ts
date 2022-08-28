import { Module } from '@nestjs/common';
import { connection as RDBConnetion } from '@infrastructure/rdb/config/connection';
import { InternalApiModule } from '@presentation/internal';

@Module({
  imports: [InternalApiModule, RDBConnetion],
})
export class ApiModule {}
