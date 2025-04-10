import {
  Body,
  Controller,
  Get,
  Post,
  Put,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  UsePipes,
} from '@nestjs/common';
import {
  CreateUserProfileDtoClass,
  CreateUserProfileDto,
  CreateUserProfileSchema,
} from '../dtos/user.dto';
import { ZodValidationPipe } from 'src/shared/pipes/zod-validation.pipe';
import { UpdateUserUseCase } from '../uses-cases/update';
import { FindByIdUseCase } from '../uses-cases/find-by-id';
import { FileUploadError, UserIdError } from 'src/shared/utils/exceptions';
import { JwtAuthGuard } from 'src/core/infrastructure/middleware/jwt-auth.guard';
import { FileInterceptor } from '@nestjs/platform-express/multer';
import { diskStorage } from 'multer';
import { extname } from 'path';
import * as fs from 'fs';
import { ApiSwagger, ApiTagsDecorator } from 'src/shared/decorators/api-swagger.decorator';

@Controller('users')
@ApiTagsDecorator(["Users"])
@UseGuards(JwtAuthGuard)
export class UserController {
  constructor(
    private readonly updateUserUseCase: UpdateUserUseCase,
    private readonly findByIdUseCase: FindByIdUseCase
  ) {}

  @Put('')
  @ApiSwagger({
    summary: 'Actualizar perfil de usuario',
    bodyType: CreateUserProfileDtoClass,
    responses: [
      { status: 200, description: 'Perfil actualizado correctamente' },
      { status: 400, description: 'Datos inválidos' },
      { status: 401, description: 'No autorizado' },
    ],
  })
  @UsePipes(new ZodValidationPipe(CreateUserProfileSchema))
  update(@Body() body: CreateUserProfileDto, @Req() req: Request) {
    const userId = req['userId'] as string | undefined;
    return this.updateUserUseCase.execute(body, userId);
  }

  @Get('profile')
  @ApiSwagger({
    summary: 'Obtener el perfil de usuario',
    responses: [
      { status: 200, description: 'Perfil obtenido correctamente' },
      { status: 401, description: 'No autorizado' },
    ],
  })
  get(@Req() req: Request) {
    const userId = req['userId'] as string | undefined;
    if (!userId) {
      throw new UserIdError('User ID is required');
    }
    return this.findByIdUseCase.execute(userId);
  }

  @Post('upload')
  @ApiSwagger({
    summary: 'Subir imagen del usuario',
    consumes: 'multipart/form-data',
    responses: [
      { status: 200, description: 'Archivo subido correctamente' },
      { status: 400, description: 'Solo se permiten imágenes PNG, JPG, JPEG o WEBP' },
      { status: 401, description: 'No autorizado' },
    ],
  })
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: (req, file, cb) => {
          const userId = req['userId'];
          const uploadPath = `./public/uploads/${userId}`;

          if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
          }

          cb(null, uploadPath);
        },
        filename: (req, file, cb) => {
          const userId = req['userId'];
          const ext = extname(file.originalname);
          const filename = `${userId}${ext}`;

          const filePath = `./public/uploads/${userId}/${filename}`;
          if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
          }

          cb(null, filename);
        },
      }),
      limits: { fileSize: 20 * 1024 * 1024 },
      fileFilter: (req, file, cb) => {
        const allowedTypes = ['image/png', 'image/jpeg', 'image/webp'];
        if (!allowedTypes.includes(file.mimetype)) {
          return cb(
            new FileUploadError('Solo se permiten imágenes PNG, JPG, JPEG o WEBP'),
            false
          );
        }
        cb(null, true);
      },
    })
  )
  uploadFile(@UploadedFile() file: Express.Multer.File, @Req() req: Request) {
    const userId = req['userId'] as string | undefined;
    return {
      message: 'File uploaded successfully!',
      path: file.path,
      userId: userId,
    };
  }
}