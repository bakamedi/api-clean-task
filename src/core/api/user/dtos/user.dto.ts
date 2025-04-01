import { ApiProperty } from '@nestjs/swagger';
import { z } from 'zod';

export const CreateUserProfileSchema = z.object({
  email: z.string().email().nonempty(),
  firstName: z.string().max(20).nonempty(),
  lastName: z.string().max(20).nonempty(),
  fullName: z.string().max(120).nonempty(),
});

export type CreateUserProfileDto = z.infer<typeof CreateUserProfileSchema>;

export class CreateUserProfileDtoClass {
  @ApiProperty({ example: 'usuario@email.com' })
  email: string;

  @ApiProperty({ example: 'Juan' })
  firstName: string;

  @ApiProperty({ example: 'Pérez' })
  lastName: string;

  @ApiProperty({ example: 'Juan Pérez' })
  fullName: string;
}
