// src/common/guards/jwt-auth.guard.ts
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';
import { JwtService } from '@nestjs/jwt';
import { AuthenticationError, UserIdError } from 'src/shared/utils/exceptions';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const req = context.switchToHttp().getRequest<Request>();
    try {
      const authHeader: string | undefined =
        typeof req.headers['authorization'] === 'string'
          ? req.headers['authorization']
          : (req.headers.get?.('authorization') ?? undefined);
      if (!authHeader || typeof authHeader !== 'string') {
        throw new AuthenticationError(
          'Authorization header is missing or invalid',
        );
      }
      const token = authHeader.split(' ')[1];
      const decoded = this.jwtService.verify<{ id: string }>(token);
      if (!decoded.id) {
        throw new UserIdError('User ID is missing or invalid in token');
      }

      req['userId'] = decoded.id;

      return true;
    } catch (err) {
      console.log(err);

      return false;
    }
  }
}
