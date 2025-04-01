import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module'; // Adjust the path as necessary
import { TaskModule } from './task/task.module';

@Module({
  imports: [DatabaseModule, AuthModule, UserModule, TaskModule],
  controllers: [],
  providers: [],
})
export class ApiModule {}
