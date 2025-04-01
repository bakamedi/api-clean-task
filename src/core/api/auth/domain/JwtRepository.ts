import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from 'jsonwebtoken';
import { IJWT } from './interfaces/IJWT';

@Injectable()
export class JwtTokenRepository implements IJWT {
  constructor(private readonly jwtService: JwtService) {}
  sign(payload: object): Promise<string> {
    return this.jwtService.signAsync(payload);
  }
  verify(token: string): JwtPayload {
    return this.jwtService.signAsync(token);
  }
}
