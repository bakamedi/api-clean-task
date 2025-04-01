import { Injectable } from '@nestjs/common';
import { ITask } from './interfaces/ITask';
import { CreateTaskDTO } from '../dtos/create-task.dto';
import { UpdateTaskDTO } from '../dtos/update-task.dto';
import { PrismaService } from 'src/core/database/services/prisma.service';
import { Task } from './Task';
import { PaginatedResponse } from 'src/shared/interfaces/paginated.interface';
import { NotFoundError } from 'src/shared/utils/exceptions';

@Injectable()
export class TaskRepository implements ITask {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(
    userId: string,
    page: number,
    limit: number,
  ): Promise<PaginatedResponse<Task>> {
    const offset = (page - 1) * limit;
    const tasks: Task[] = (
      await this.prisma.task.findMany({
        where: { userId: userId },
        skip: offset,
        take: limit,
      })
    ).map((task) => ({
      ...task,
      description: task.description ?? 'No description provided',
    }));
    const totalTasks = await this.prisma.task.count({
      where: {
        userId: userId,
      },
    });
    const totalPages = Math.ceil(totalTasks / limit);
    return {
      pagination: {
        totalItems: totalTasks,
        totalPages: totalPages,
        currentPage: page,
        pageSize: limit,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
      },
      data: tasks,
    };
  }

  async findById(id: string, userId: string): Promise<Task> {
    const taskFound: {
      id: string;
      title: string;
      description: string | null;
      completed: boolean;
      userId: string;
    } | null = await this.prisma.task.findUnique({
      where: { id: id, userId: userId },
    });

    if (!taskFound) {
      throw new NotFoundError('Task not found');
    }

    return {
      id: taskFound.id,
      title: taskFound.title,
      description: taskFound.description ?? 'No description provided',
      completed: taskFound.completed,
    };
  }

  async create(task: CreateTaskDTO, userId: string): Promise<Task> {
    const taskCreated = await this.prisma.task.create({
      data: {
        title: task.title,
        description: task.description,
        completed: task.completed,
        userId: userId,
      },
    });
    return {
      id: taskCreated.id,
      title: taskCreated.title,
      description: taskCreated.description ?? '',
      completed: taskCreated.completed,
    };
  }

  async update(id: string, userId: string, task: UpdateTaskDTO): Promise<Task> {
    const taskFound: {
      id: string;
      title: string;
      description: string | null;
      completed: boolean;
      userId: string;
    } | null = await this.prisma.task.findUnique({
      where: { id: id, userId: userId },
    });

    if (!taskFound) {
      throw new NotFoundError('Task not found');
    }

    const taskUpdated = await this.prisma.task.update({
      where: { id: id, userId: userId },
      data: {
        title: task.title,
        description: task.description,
        completed: task.completed,
        userId: userId,
      },
    });
    return {
      id: taskUpdated.id,
      title: taskUpdated.title,
      description: taskUpdated.description ?? '',
      completed: taskUpdated.completed,
    };
  }

  async delete(id: string, userId: string): Promise<Task> {
    const taskFound: {
      id: string;
      title: string;
      description: string | null;
      completed: boolean;
      userId: string;
    } | null = await this.prisma.task.findUnique({
      where: { id: id, userId: userId },
    });

    if (!taskFound) {
      throw new NotFoundError('Task not found');
    }
    const taskDeleted = await this.prisma.task.delete({
      where: { id: id, userId: userId },
    });
    return {
      id: taskDeleted.id,
      title: taskDeleted.title,
      description: taskDeleted.description ?? '',
      completed: taskDeleted.completed,
    };
  }
}
