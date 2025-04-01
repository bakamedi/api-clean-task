import { Injectable } from '@nestjs/common';
import { TaskRepository } from '../domain/TaskRepository';
import { CreateTaskDTO } from '../dtos/create-task.dto';

@Injectable()
export class CreateTaskUseCase {
  constructor(private readonly taskRepository: TaskRepository) {}

  async execute(
    createTaskDto: CreateTaskDTO,
    userId: string,
  ): Promise<CreateTaskDTO> {
    const taskCreated = await this.taskRepository.create(createTaskDto, userId);
    return taskCreated;
  }
}
