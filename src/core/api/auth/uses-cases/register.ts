import { Injectable } from '@nestjs/common';
import { UseCase } from 'src/shared/interfaces/use-case.interface';
import { BcryptRepository } from '../domain/BcryptRepository';
import { CreateUserDto } from '../dtos/create-user.dto';
import { PrismaService } from 'src/core/database/services/prisma.service';
import { ConflictError } from 'src/shared/utils/exceptions';
import { JwtTokenRepository } from '../domain/JwtRepository';

@Injectable()
export class RegisterUseCase
  implements UseCase<CreateUserDto, { token: string }>
{
  constructor(
    private readonly bcryptRepository: BcryptRepository,
    private readonly jwtTokenRepository: JwtTokenRepository,
    private readonly prisma: PrismaService,
  ) {}

  async execute(request: CreateUserDto): Promise<{ token: string }> {
    const { email, password, firstName, lastName } = request;
    const userFound = await this.prisma.user.findUnique({
      where: { email },
    });

    if (userFound) {
      throw new ConflictError('User existe');
    }
    const hashedPassword = this.bcryptRepository.hash(password);
    const user = await this.prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        firstName,
        lastName,
        fullName: `${firstName} ${lastName}`,
      },
    });
    const token = await this.jwtTokenRepository.sign({ id: user.id });
    return { token };
  }
}
