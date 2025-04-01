import { ApiProperty } from '@nestjs/swagger';
import { z } from 'zod';

export const CreateTaskSchema = z.object({
  title: z.string().nonempty().max(100),
  description: z.string().max(500).optional(),
  completed: z.boolean().default(false).optional(),
});

export type CreateTaskDTO = z.infer<typeof CreateTaskSchema>;

export class CreateTaskDTOClass {
  @ApiProperty({ example: 'titulo super genial' })
  title: string;

  @ApiProperty({ example: 'algo bien detallado' })
  description: string;

  @ApiProperty({ example: 'true or false' })
  completed: boolean;
}
