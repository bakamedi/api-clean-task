import { Injectable } from '@nestjs/common';
import { IUser } from './interfaces/IUser';
import { User } from './User';
import { PrismaService } from 'src/core/database/services/prisma.service';
import { NotFoundError } from 'src/shared/utils/exceptions';
import { CreateUserProfileDto } from '../dtos/user.dto';

@Injectable()
export class UserRepository implements IUser {
  constructor(private readonly prisma: PrismaService) {}

  async findById(userId: string): Promise<User> {
    const userFound: {
      id: string;
      email: string;
      firstName: string;
      fullName: string;
      lastName: string;
    } | null = await this.prisma.user.findUnique({
      where: { id: userId },
    });
    if (!userFound) {
      throw new NotFoundError('User not found');
    }
    return {
      id: userFound.id,
      email: userFound.email,
      firstName: userFound.firstName ?? '',
      fullName: userFound.fullName,
      lastName: userFound.lastName,
    };
  }

  async update(id: string, updateData: CreateUserProfileDto): Promise<User> {
    const userFound: {
      id: string;
      email: string;
      firstName: string;
      fullName: string;
      lastName: string;
    } | null = await this.prisma.user.findUnique({
      where: { id: id },
    });
    if (!userFound) {
      throw new NotFoundError('User not found');
    }

    const updatedUser: {
      id: string;
      email: string;
      firstName: string;
      fullName: string;
      lastName: string;
    } | null = await this.prisma.user.update({
      where: { id: id },
      data: {
        firstName: updateData.firstName,
        lastName: updateData.lastName,
        fullName: `${updateData.firstName} ${updateData.lastName}`,
      },
      omit: { password: true },
    });

    return updatedUser;
  }

  async delete(id: string): Promise<User> {
    const userFound: {
      id: string;
      email: string;
      firstName: string;
      fullName: string;
      lastName: string;
    } | null = await this.prisma.user.findUnique({
      where: { id: id },
    });
    if (!userFound) {
      throw new NotFoundError('User not found');
    }
    const deletedUser = await this.prisma.user.delete({
      where: { id },
      omit: { password: true },
    });

    return deletedUser;
  }
}
