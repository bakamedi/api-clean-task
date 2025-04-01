import { Injectable } from '@nestjs/common';
import { UseCase } from 'src/shared/interfaces/use-case.interface';
import { User } from '../domain/User';
import { UserRepository } from '../domain/UserRepository';
import { CreateUserProfileDto } from '../dtos/user.dto';

@Injectable()
export class UpdateUserUseCase implements UseCase<CreateUserProfileDto, User> {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(request: CreateUserProfileDto, userId?: string): Promise<User> {
    return this.userRepository.update(userId ?? '', request);
  }
}
