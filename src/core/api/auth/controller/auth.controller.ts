import {
  Body,
  Controller,
  Post,
  UsePipes,
} from '@nestjs/common';
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
import { ApiSwagger, ApiTagsDecorator } from 'src/shared/decorators/api-swagger.decorator'; // Importa los decoradores

@ApiTagsDecorator(['Authentication']) // Etiquetas para Swagger
@Controller('auth')
export class AuthController {
  constructor(
    private readonly registerUseCase: RegisterUseCase,
    private readonly loginUseCase: LoginUseCase,
  ) {}

  @Post('register')
  @ApiSwagger({
    summary: 'Registrar un nuevo usuario',
    bodyType: CreateUserDtoClass,
    responses: [
      { status: 201, description: 'Usuario creado exitosamente.' },
      { status: 409, description: 'El usuario ya existe.' },
      { status: 500, description: 'Error interno del servidor.' },
    ],
  })
  @UsePipes(new ZodValidationPipe(CreateUserSchema))
  create(@Body() body: CreateUserDto) {
    return this.registerUseCase.execute(body);
  }

  @Post('login')
  @ApiSwagger({
    summary: 'Autenticar un usuario',
    bodyType: LoginUserDtoClass,
    responses: [
      { status: 200, description: 'Autenticación exitosa.' },
      { status: 404, description: 'El usuario no existe.' },
      { status: 401, description: 'Error en la autenticación.' },
      { status: 500, description: 'Error interno del servidor.' },
    ],
  })
  @UsePipes(new ZodValidationPipe(LoginUserSchema))
  login(@Body() body: LoginUserDto) {
    return this.loginUseCase.execute(body);
  }
}