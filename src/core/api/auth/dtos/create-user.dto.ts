import { ApiProperty } from '@nestjs/swagger';
import { z } from 'zod';

export const CreateUserSchema = z.object({
  email: z.string().nonempty().email(),
  password: z.string().nonempty().min(6),
  firstName: z.string().nonempty().max(20),
  lastName: z.string().nonempty().max(20),
});

export type CreateUserDto = z.infer<typeof CreateUserSchema>;

export class CreateUserDtoClass {
  @ApiProperty({ example: 'usuario@email.com' })
  email: string;

  @ApiProperty({ example: 'SuperPassword123!' })
  password: string;

  @ApiProperty({ example: 'Juan' })
  firstName: string;

  @ApiProperty({ example: 'Pérez' })
  lastName: string;
}
