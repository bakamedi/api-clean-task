import { Injectable } from '@nestjs/common';
import { TaskRepository } from '../domain/TaskRepository';
import { PaginatedResponse } from 'src/shared/interfaces/paginated.interface';
import { Task } from '../domain/Task';
import { UseCase } from 'src/shared/interfaces/use-case.interface';
import { MissingParameterError } from 'src/shared/utils/exceptions';

interface FindAllTasksRequest {
  userId: string;
  page: number;
  limit: number;
}

@Injectable()
export class FindAllTaskUseCase
  implements UseCase<FindAllTasksRequest, PaginatedResponse<Task>>
{
  constructor(private readonly taskRepository: TaskRepository) {}

  async execute(
    request: FindAllTasksRequest,
  ): Promise<PaginatedResponse<Task>> {
    const { userId, page, limit } = request;
    if (!userId || page === undefined || limit === undefined) {
      throw new MissingParameterError('Missing required parameters');
    }
    return await this.taskRepository.findAll(userId, page, limit);
  }
}
