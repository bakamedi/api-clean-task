import {
  Body,
  Controller,
  Get,
  Put,
  Req,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import {
  CreateUserProfileDto,
  CreateUserProfileDtoClass,
  CreateUserProfileSchema,
} from '../dtos/user.dto';
import { ZodValidationPipe } from 'src/shared/pipes/zod-validation.pipe';
import { UpdateUserUseCase } from '../uses-cases/update';
import { JwtAuthGuard } from 'src/core/infrastructure/middleware/jwt-auth.guard';
import { FindByIdUseCase } from '../uses-cases/find-by-id';
import { UserIdError } from 'src/shared/utils/exceptions';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('Users')
@ApiBearerAuth()
@Controller('users')
@UseGuards(JwtAuthGuard)
export class UserController {
  constructor(
    private readonly updateUserUseCase: UpdateUserUseCase,
    private findByIdUseCase: FindByIdUseCase,
  ) {}

  @Put('')
  @ApiOperation({ summary: 'Actualizar perfil de usuario' })
  @ApiBody({ type: CreateUserProfileDtoClass })
  @ApiResponse({ status: 200, description: 'Perfil actualizado correctamente' })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  @UsePipes(new ZodValidationPipe(CreateUserProfileSchema))
  update(@Body() body: CreateUserProfileDto, @Req() req: Request) {
    const userId = req['userId'] as string | undefined;
    return this.updateUserUseCase.execute(body, userId);
  }

  @Get('profile')
  @ApiOperation({ summary: 'Obtener el perfil de usuario' })
  @ApiResponse({ status: 200, description: 'Perfil obtenido correctamente' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  get(@Req() req: Request) {
    const userId = req['userId'] as string | undefined;
    if (!userId) {
      throw new UserIdError('User ID is required');
    }
    return this.findByIdUseCase.execute(userId);
  }
}
