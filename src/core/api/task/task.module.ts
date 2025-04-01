import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/core/database/database.module';
import { TaskRepository } from './domain/TaskRepository';
import { CreateTaskUseCase } from './uses-cases/create';
import { TaskController } from './controller/task.controller';
import { FindAllTaskUseCase } from './uses-cases/find-all';
import { UpdateTaskUseCase } from './uses-cases/update';
import { FindByIdTaskUseCase } from './uses-cases/find-by-id';
import { DeleteTaskUseCase } from './uses-cases/delete';

@Module({
  imports: [DatabaseModule],
  controllers: [TaskController],
  providers: [
    TaskRepository,
    CreateTaskUseCase,
    UpdateTaskUseCase,
    DeleteTaskUseCase,
    FindByIdTaskUseCase,
    FindAllTaskUseCase,
  ],
  exports: [
    TaskRepository,
    CreateTaskUseCase,
    UpdateTaskUseCase,
    DeleteTaskUseCase,
    FindByIdTaskUseCase,
    FindAllTaskUseCase,
  ],
})
export class TaskModule {}
