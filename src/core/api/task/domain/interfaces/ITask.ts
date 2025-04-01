import { PaginatedResponse } from 'src/shared/interfaces/paginated.interface';
import { CreateTaskDTO } from '../../dtos/create-task.dto';
import { UpdateTaskDTO } from '../../dtos/update-task.dto';
import { Task } from '../Task';

export interface ITask {
  findById(id: string, userId: string): Promise<Task>;
  findAll(
    userId: string,
    page: number,
    limit: number,
  ): Promise<PaginatedResponse<Task>>;
  create(task: CreateTaskDTO, userId: string): Promise<Task>;
  update(id: string, userId: string, task: UpdateTaskDTO): Promise<Task>;
  delete(id: string, userId: string): Promise<Task>;
}
