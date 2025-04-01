import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/core/database/database.module';
import { UserController } from './controller/user.controller';
import { UserRepository } from './domain/UserRepository';
import { UpdateUserUseCase } from './uses-cases/update';
import { FindByIdUseCase } from './uses-cases/find-by-id';

@Module({
  imports: [DatabaseModule],
  controllers: [UserController],
  providers: [UserRepository, UpdateUserUseCase, FindByIdUseCase],
  exports: [UserRepository, UpdateUserUseCase, FindByIdUseCase],
})
export class UserModule {}
