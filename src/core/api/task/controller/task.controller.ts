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
import { ApiSwagger, ApiTagsDecorator } from "src/shared/decorators/api-swagger.decorator"; // Importa el decorador

@Controller("tasks")
@UseGuards(JwtAuthGuard)

@ApiTagsDecorator(["Tasks"])
export class TaskController {
  constructor(
    private readonly createTaskUseCase: CreateTaskUseCase,
    private readonly updateTaskUseCase: UpdateTaskUseCase,
    private readonly deleteTaskUseCase: DeleteTaskUseCase,
    private readonly findByIdTaskUseCase: FindByIdTaskUseCase,
    private readonly findAllTaskUseCase: FindAllTaskUseCase
  ) {}

  @Post("")
  @ApiSwagger({
    summary: "Crear una nueva tarea",
    bodyType: CreateTaskDTOClass,
    responses: [
      { status: 201, description: "Tarea creada exitosamente" },
      { status: 400, description: "Datos inválidos" },
    ],
  })
  @UsePipes(new ZodValidationPipe(CreateTaskSchema))
  create(@Body() body: CreateTaskDTO, @Req() req: Request) {
    const userId = (req["userId"] as string | undefined) ?? "";
    return this.createTaskUseCase.execute(body, userId);
  }

  @Get()
  @ApiSwagger({
    summary: "Obtener todas las tareas paginadas",
    queryParams: [
      { name: "page", required: false, example: 1 },
      { name: "limit", required: false, example: 10 },
      { name: "completed", required: false, example: false },
      { name: "search", required: false, example: "nombre_titulo" },
    ],
    responses: [
      { status: 200, description: "Lista de tareas obtenida" },
    ],
  })
  findAll(
    @Req() req: Request,
    @Query("page") page: number = 1,
    @Query("limit") limit: number = 10,
    @Query("completed") completed?: boolean,
    @Query("search") search?: string
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
  @ApiSwagger({
    summary: "Actualizar una tarea",
    bodyType: UpdateTaskDTOClass,
    responses: [
      { status: 200, description: "Tarea actualizada exitosamente" },
      { status: 404, description: "Tarea no encontrada" },
    ],
  })
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
  @ApiSwagger({
    summary: "Obtener una tarea por ID",
    responses: [
      { status: 200, description: "Tarea encontrada" },
      { status: 404, description: "Tarea no encontrada" },
    ],
  })
  findByID(@Param("id") id: string, @Req() req: Request) {
    const userId = (req["userId"] as string | undefined) ?? "";
    return this.findByIdTaskUseCase.execute(id, userId);
  }

  @Delete(":id")
  @ApiSwagger({
    summary: "Eliminar una tarea",
    responses: [
      { status: 200, description: "Tarea eliminada exitosamente" },
      { status: 404, description: "Tarea no encontrada" },
    ],
  })
  delete(@Param("id") id: string, @Req() req: Request) {
    const userId = (req["userId"] as string | undefined) ?? "";
    return this.deleteTaskUseCase.execute(id, userId);
  }
}