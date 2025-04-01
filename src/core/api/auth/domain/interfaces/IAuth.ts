import { AuthUser } from '../AuthUser';

export interface IAuth {
  create(email: string, password: string): Promise<AuthUser>;
  find(email: string): Promise<AuthUser | null>;
}
