// src/core/infrastructure/interceptors/response.interceptor.ts
import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((rawResponse) => {
        if (rawResponse && typeof rawResponse === 'object' && 'data' in rawResponse) {
          return rawResponse;
        }

        return {
          data: rawResponse || {}, // Si es `null` o `undefined`, devolvemos un objeto vacío
        };
      }),
    );
  }
}