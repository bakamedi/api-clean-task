import { Injectable } from '@nestjs/common';
import { UseCase } from 'src/shared/interfaces/use-case.interface';
import { Task } from '../domain/Task';
import { TaskRepository } from '../domain/TaskRepository';
import { MissingParameterError } from 'src/shared/utils/exceptions';

@Injectable()
export class DeleteTaskUseCase implements UseCase<string, Task> {
  constructor(private readonly taskRepository: TaskRepository) {}

  async execute(id?: string, userId?: string): Promise<Task> {
    if (!userId || !id) {
      throw new MissingParameterError('Missing required parameters');
    }
    return await this.taskRepository.delete(id, userId);
  }
}
