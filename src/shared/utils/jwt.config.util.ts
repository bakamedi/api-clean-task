import { JwtModuleOptions } from '@nestjs/jwt';

export const jwtConstants = {
  secret: process.env.JWT_SECRET,
};

export const jwtConfigUtil: JwtModuleOptions = {
  secret: jwtConstants.secret,
};
