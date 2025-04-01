import { CreateUserProfileDto } from '../../dtos/user.dto';
import { User } from '../User';

export interface IUser {
  findById(id: string): Promise<User>;
  update(id: string, createUserProfileDto: CreateUserProfileDto): Promise<User>;
  delete(id: string): Promise<User>;
}
