import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
  UsePipes,
} from "@nestjs/common";
import { JwtAuthGuard } from "src/core/infrastructure/middleware/jwt-auth.guard";

import { ZodValidationPipe } from "src/shared/pipes/zod-validation.pipe";
import {
  CreateTaskDTO,
  CreateTaskDTOClass,
  CreateTaskSchema,
} from "../dtos/create-task.dto";
import { CreateTaskUseCase } from "../uses-cases/create";
import { FindAllTaskUseCase } from "../uses-cases/find-all";
import { UpdateTaskUseCase } from "../uses-cases/update";
import { UpdateTaskDTO, UpdateTaskDTOClass } from "../dtos/update-task.dto";
import { FindByIdTaskUseCase } from "../uses-cases/find-by-id";
import { DeleteTaskUseCase } from "../uses-cases/delete";
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from "@nestjs/swagger";

@ApiTags("Tasks")
@ApiBearerAuth()
@Controller("tasks")
@UseGuards(JwtAuthGuard)
export class TaskController {
  constructor(
    private readonly createTaskUseCase: CreateTaskUseCase,
    private readonly updateTaskUseCase: UpdateTaskUseCase,
    private readonly deleteTaskUseCase: DeleteTaskUseCase,
    private readonly findByIdTaskUseCase: FindByIdTaskUseCase,
    private readonly findAllTaskUseCase: FindAllTaskUseCase
  ) {}

  @Post("")
  @ApiOperation({ summary: "Crear una nueva tarea" })
  @ApiBody({ type: CreateTaskDTOClass })
  @ApiResponse({ status: 201, description: "Tarea creada exitosamente" })
  @ApiResponse({ status: 400, description: "Datos inválidos" })
  @UsePipes(new ZodValidationPipe(CreateTaskSchema))
  create(@Body() body: CreateTaskDTO, @Req() req: Request) {
    const userId = (req["userId"] as string | undefined) ?? "";
    return this.createTaskUseCase.execute(body, userId);
  }

  @Get()
  @ApiOperation({ summary: "Obtener todas las tareas paginadas" })
  @ApiQuery({ name: "page", required: false, example: 1 })
  @ApiQuery({ name: "limit", required: false, example: 10 })
  @ApiQuery({ name: "completed", required: false, example: false })
  @ApiQuery({ name: "search", required: false, example: "nombre_titulo" })
  @ApiResponse({ status: 200, description: "Lista de tareas obtenida" })
  findAll(
    @Req() req: Request,
    @Query("page") page: number = 1,
    @Query("limit") limit: number = 10,
    @Query("completed") completed?: boolean,
    @Query("search") search?: string,
  ) {
    const userId = (req["userId"] as string | undefined) ?? "";
    page = page && Number.isInteger(page) ? page : 1;
    limit = limit && Number.isInteger(limit) ? limit : 10;
    return this.findAllTaskUseCase.execute({
      userId,
      page,
      limit,
      completed,
      search,
    });
  }

  @Put(":id")
  @ApiOperation({ summary: "Actualizar una tarea" })
  @ApiBody({ type: UpdateTaskDTOClass })
  @ApiResponse({ status: 200, description: "Tarea actualizada exitosamente" })
  @ApiResponse({ status: 404, description: "Tarea no encontrada" })
  update(
    @Param("id") id: string,
    @Body() updateTaskDTO: UpdateTaskDTO,
    @Req() req: Request
  ) {
    const userId = (req["userId"] as string | undefined) ?? "";
    return this.updateTaskUseCase.execute({
      id,
      userId,
      data: updateTaskDTO,
    });
  }

  @Get(":id")
  @ApiOperation({ summary: "Obtener una tarea por ID" })
  @ApiResponse({ status: 200, description: "Tarea encontrada" })
  @ApiResponse({ status: 404, description: "Tarea no encontrada" })
  findByID(@Param("id") id: string, @Req() req: Request) {
    const userId = (req["userId"] as string | undefined) ?? "";
    return this.findByIdTaskUseCase.execute(id, userId);
  }

  @Delete(":id")
  @ApiOperation({ summary: "Eliminar una tarea" })
  @ApiResponse({ status: 200, description: "Tarea eliminada exitosamente" })
  @ApiResponse({ status: 404, description: "Tarea no encontrada" })
  delete(@Param("id") id: string, @Req() req: Request) {
    const userId = (req["userId"] as string | undefined) ?? "";
    return this.deleteTaskUseCase.execute(id, userId);
  }
}
