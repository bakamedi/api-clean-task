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
} from "@nestjs/common";
import {
  CreateUserProfileDto,
  CreateUserProfileDtoClass,
  CreateUserProfileSchema,
} from "../dtos/user.dto";
import { ZodValidationPipe } from "src/shared/pipes/zod-validation.pipe";
import { UpdateUserUseCase } from "../uses-cases/update";
import { JwtAuthGuard } from "src/core/infrastructure/middleware/jwt-auth.guard";
import { FindByIdUseCase } from "../uses-cases/find-by-id";
import { FileUploadError, UserIdError } from "src/shared/utils/exceptions";
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from "@nestjs/swagger";
import { diskStorage } from "multer";
import { extname } from "path";
import * as fs from "fs";
import { FileInterceptor } from "@nestjs/platform-express/multer";

@ApiTags("Users")
@ApiBearerAuth()
@Controller("users")
@UseGuards(JwtAuthGuard)
export class UserController {
  constructor(
    private readonly updateUserUseCase: UpdateUserUseCase,
    private findByIdUseCase: FindByIdUseCase
  ) {}

  @Put("")
  @ApiOperation({ summary: "Actualizar perfil de usuario" })
  @ApiBody({ type: CreateUserProfileDtoClass })
  @ApiResponse({ status: 200, description: "Perfil actualizado correctamente" })
  @ApiResponse({ status: 400, description: "Datos inválidos" })
  @ApiResponse({ status: 401, description: "No autorizado" })
  @UsePipes(new ZodValidationPipe(CreateUserProfileSchema))
  update(@Body() body: CreateUserProfileDto, @Req() req: Request) {
    const userId = req["userId"] as string | undefined;
    return this.updateUserUseCase.execute(body, userId);
  }

  @Get("profile")
  @ApiOperation({ summary: "Obtener el perfil de usuario" })
  @ApiResponse({ status: 200, description: "Perfil obtenido correctamente" })
  @ApiResponse({ status: 401, description: "No autorizado" })
  get(@Req() req: Request) {
    const userId = req["userId"] as string | undefined;
    if (!userId) {
      throw new UserIdError("User ID is required");
    }
    return this.findByIdUseCase.execute(userId);
  }

  @Post("upload")
  @ApiOperation({ summary: "Subir imagen del usuario" })
  @ApiConsumes("multipart/form-data")
  @ApiResponse({ status: 401, description: "No autorizado" })
  @ApiResponse({
    status: 400,
    description: "Solo se permiten imágenes PNG, JPG, JPEG o WEBP",
  })
  @ApiResponse({ status: 200, description: "Archivo subido correctamente" })
  @UseInterceptors(
    FileInterceptor("file", {
      storage: diskStorage({
        destination: (req, file, cb) => {
          const userId = req["userId"]; // Usa el userId del token
          const uploadPath = `./public/uploads/${userId}`;

          const fs = require("fs");
          if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
          }

          cb(null, uploadPath);
        },

        filename: (req, file, cb) => {
          const userId = req["userId"];
          const ext = extname(file.originalname);
          const filename = `${userId}${ext}`; // Aquí usas el userId o cualquier identificador único como nombre

          // Verificar si el archivo ya existe y eliminarlo
          const filePath = `./public/uploads/${userId}/${filename}`;
          if (fs.existsSync(filePath)) {
            // Elimina el archivo existente
            fs.unlinkSync(filePath);
          }

          cb(null, filename); // Guardar el nuevo archivo con el mismo nombre
        },
      }),
      limits: {
        fileSize: 20 * 1024 * 1024, // 20 MB
      },
      fileFilter: (req, file, cb) => {
        const allowedTypes = [
          "image/png",
          "image/jpeg", // .jpg y .jpeg
          "image/webp", // opcional: si quieres soporte moderno
        ];

        if (!allowedTypes.includes(file.mimetype)) {
          return cb(
            new FileUploadError(
              "Solo se permiten imágenes PNG, JPG, JPEG o WEBP"
            ),
            false
          );
        }

        cb(null, true);
      },
    })
  )
  uploadFile(@UploadedFile() file: Express.Multer.File, @Req() req: Request) {
    const userId = req["userId"] as string | undefined;

    return {
      message: "File uploaded successfully!",
      path: file.path,
      userId: userId,
    };
  }
}
