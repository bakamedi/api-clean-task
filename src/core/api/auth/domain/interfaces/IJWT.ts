import { JwtPayload } from 'jsonwebtoken';

export interface IJWT {
  sign(payload: object): Promise<string>;
  verify(token: string): JwtPayload;
}
