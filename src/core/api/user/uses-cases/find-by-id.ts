import { Injectable } from '@nestjs/common';
import { UseCase } from 'src/shared/interfaces/use-case.interface';
import { User } from '../domain/User';
import { UserRepository } from '../domain/UserRepository';

@Injectable()
export class FindByIdUseCase implements UseCase<string, User> {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(id: string): Promise<User> {
    return this.userRepository.findById(id);
  }
}
