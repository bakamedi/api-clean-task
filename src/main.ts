import { NestFactory } from "@nestjs/core";
import { AppModule } from "./core/app.module";
import { ValidationPipe } from "@nestjs/common";
import { ResponseInterceptor } from "./core/infrastructure/interceptors/response.interceptor";
import { HttpExceptionFilter } from "./core/infrastructure/exceptions/http-exception.filter";
import { setupSwagger } from "./core/infrastructure/config/swagger.setup";
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix("v1/api");
  
  // Configuraciones globales
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
    })
  );
  app.enableCors({
    origin: process.env.ORIGIN_URL, // URL de tu frontend
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true, // Si usas cookies o autenticación
  });
  app.useGlobalInterceptors(new ResponseInterceptor());
  app.useGlobalFilters(new HttpExceptionFilter());

  setupSwagger(app);

  // Imprimir log cuando el servidor se haya levantado
  await app.listen(process.env.PORT ?? 3000, () => {
    Logger.log(`Server running on port ${process.env.PORT ?? 3000}`, 'Bootstrap');
  });
}

// eslint-disable-next-line @typescript-eslint/no-floating-promises
bootstrap();