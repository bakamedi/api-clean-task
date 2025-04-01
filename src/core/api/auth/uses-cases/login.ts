import { PrismaService } from 'src/core/database/services/prisma.service';
import { BcryptRepository } from '../domain/BcryptRepository';
import { LoginUserDto } from '../dtos/login-user.dtos';
import {
  AuthenticationError,
  BadRequestError,
} from 'src/shared/utils/exceptions';
import { UseCase } from 'src/shared/interfaces/use-case.interface';
import { Injectable } from '@nestjs/common';
import { JwtTokenRepository } from '../domain/JwtRepository';

@Injectable()
export class LoginUseCase implements UseCase<LoginUserDto, { token: string }> {
  constructor(
    private readonly bcryptRepository: BcryptRepository,
    private readonly jwtTokenRepository: JwtTokenRepository,
    private readonly prisma: PrismaService,
  ) {}

  async execute(request: LoginUserDto): Promise<{ token: string }> {
    const { email, password } = request;

    const userFound = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!userFound) {
      throw new BadRequestError('User not found');
    }

    const isPasswordValid = this.bcryptRepository.compare(
      password,
      userFound.password,
    );
    if (!isPasswordValid) {
      throw new AuthenticationError('Invalid password');
    }

    const token = await this.jwtTokenRepository.sign({ id: userFound.id });

    return { token };
  }
}
