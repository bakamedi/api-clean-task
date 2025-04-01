import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { CustomError } from 'src/shared/utils/exceptions';

@Catch() // 👈 Atrapa TODOS los errores, no solo HttpException
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    // 👇 Determina el status y el mensaje según el tipo de error
    let status: number;
    let message: string;

    if (exception instanceof HttpException) {
      // Si es una HttpException de NestJS
      status = exception.getStatus();
      message = exception.message;
    }
    if (exception instanceof CustomError) {
      // Si es una AuthenticationError
      status = exception.status;
      message = exception.message;
    } else {
      // Error no controlado (Internal Server Error)
      status = 500;
      message = 'Internal Server Error';
    }

    // 👇 Construye la respuesta de error consistente
    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message: message,
      // (Opcional) Si quieres incluir más detalles en desarrollo
      ...(process.env.NODE_ENV === 'development' && {
        stack: exception instanceof Error ? exception.stack : undefined,
      }),
    });
  }
}
