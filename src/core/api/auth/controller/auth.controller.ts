import { Body, Controller, Post, UsePipes } from '@nestjs/common';
import {
  CreateUserDto,
  CreateUserDtoClass,
  CreateUserSchema,
} from '../dtos/create-user.dto';
import { ZodValidationPipe } from 'src/shared/pipes/zod-validation.pipe';
import { RegisterUseCase } from '../uses-cases/register';
import { LoginUseCase } from '../uses-cases/login';
import {
  LoginUserDto,
  LoginUserDtoClass,
  LoginUserSchema,
} from '../dtos/login-user.dtos';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly registerUseCase: RegisterUseCase,
    private readonly loginUseCase: LoginUseCase,
  ) {}

  @Post('register')
  @ApiOperation({ summary: 'Registrar un nuevo usuario' })
  @ApiBody({ type: CreateUserDtoClass })
  @ApiResponse({ status: 201, description: 'Usuario creado exitosamente.' })
  @ApiResponse({ status: 409, description: 'El usuario ya existe.' })
  @ApiResponse({ status: 500, description: 'Error interno del servidor.' })
  @UsePipes(new ZodValidationPipe(CreateUserSchema))
  create(@Body() body: CreateUserDto) {
    return this.registerUseCase.execute(body);
  }

  @Post('login')
  @ApiOperation({ summary: 'Autenticar un usuario' })
  @ApiBody({ type: LoginUserDtoClass })
  @ApiResponse({ status: 200, description: 'Autenticación exitosa.' })
  @ApiResponse({ status: 404, description: 'El usuario no existe.' })
  @ApiResponse({ status: 401, description: 'Error en la autenticación.' })
  @ApiResponse({ status: 500, description: 'Error interno del servidor.' })
  @UsePipes(new ZodValidationPipe(LoginUserSchema))
  login(@Body() body: LoginUserDto) {
    return this.loginUseCase.execute(body);
  }
}
