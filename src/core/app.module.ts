import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { ApiModule } from './api/api.module';

@Module({
  imports: [ApiModule],
  controllers: [],
  providers: [DatabaseModule],
})
export class AppModule {}
