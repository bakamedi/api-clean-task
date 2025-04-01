import { Injectable } from '@nestjs/common';
import { TaskRepository } from '../domain/TaskRepository';
import { Task } from '../domain/Task';
import { UpdateTaskDTO } from '../dtos/update-task.dto';
import { UseCase } from 'src/shared/interfaces/use-case.interface';
import { MissingParameterError } from 'src/shared/utils/exceptions';

interface UpdateTasksRequest {
  id: string;
  userId: string;
  data: UpdateTaskDTO;
}

@Injectable()
export class UpdateTaskUseCase implements UseCase<UpdateTasksRequest, Task> {
  constructor(private readonly taskRepository: TaskRepository) {}

  async execute(updateTasksRequest: UpdateTasksRequest): Promise<Task> {
    const { id, userId, data } = updateTasksRequest;
    if (!id || !userId || !data) {
      throw new MissingParameterError('Missing required parameters');
    }
    return await this.taskRepository.update(id, userId, data);
  }
}
