import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { PaginationDto } from './pagination.dto';

export interface ResponseFormat<T> {
  data: T;
}

@Injectable()
export class ResponseInterceptor<T>
  implements NestInterceptor<T, ResponseFormat<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<ResponseFormat<T>> {
    const request = context.switchToHttp().getRequest<{
      query: Record<string, string>;
      pagination?: PaginationDto;
    }>();
    const query: Record<string, string> = request.query || {};

    const paginationDto = new PaginationDto();
    paginationDto.page = query.page ? Number(query.page) : 1;
    paginationDto.limit = query.limit ? Number(query.limit) : 10;

    request.pagination = paginationDto;

    return next.handle() as Observable<ResponseFormat<T>>;
  }
}
