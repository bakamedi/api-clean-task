import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/core/database/database.module';
import { AuthController } from './controller/auth.controller';
import { RegisterUseCase } from './uses-cases/register';
import { BcryptRepository } from './domain/BcryptRepository';
import { JwtModule as Jwt } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { LoginUseCase } from './uses-cases/login';
import { JwtTokenRepository } from './domain/JwtRepository';

@Module({
  imports: [
    DatabaseModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    Jwt.registerAsync({
      global: true,
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return {
          secret: configService.get('JWT_SECRET'),
        };
      },
    }),
  ],
  controllers: [AuthController],
  providers: [
    BcryptRepository,
    JwtTokenRepository,
    RegisterUseCase,
    LoginUseCase,
  ], // Agregado aquí
  exports: [
    BcryptRepository,
    JwtTokenRepository,
    RegisterUseCase,
    LoginUseCase,
  ],
})
export class AuthModule {}
