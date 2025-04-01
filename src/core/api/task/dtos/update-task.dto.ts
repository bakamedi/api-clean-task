import { ApiProperty } from '@nestjs/swagger';
import { z } from 'zod';

export const UpdateTaskSchema = z.object({
  title: z.string().max(100).optional(),
  description: z.string().max(500).optional(),
  completed: z.boolean().optional(),
});

export type UpdateTaskDTO = z.infer<typeof UpdateTaskSchema>;

export class UpdateTaskDTOClass {
  @ApiProperty({ example: 'titulo super genial' })
  title: string;

  @ApiProperty({ example: 'algo bien detallado' })
  description: string;

  @ApiProperty({ example: 'true or false' })
  completed: boolean;
}
