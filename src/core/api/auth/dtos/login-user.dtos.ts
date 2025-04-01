import { ApiProperty } from '@nestjs/swagger';
import { z } from 'zod';

export const LoginUserSchema = z.object({
  email: z.string().nonempty().email(),
  password: z.string().nonempty().max(20),
});

export type LoginUserDto = z.infer<typeof LoginUserSchema>;

export class LoginUserDtoClass {
  @ApiProperty({ example: 'usuario@email.com' })
  email: string;

  @ApiProperty({ example: 'SuperPassword123!' })
  password: string;
}
