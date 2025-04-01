import { DocumentBuilder, SwaggerCustomOptions } from '@nestjs/swagger';

export const swaggerConfig = new DocumentBuilder()
  .setTitle('Tasks API')
  .setDescription('The tasks API description')
  .setVersion('1.0')
  .addTag('Tasks')
  .addTag('Users')
  .addBearerAuth()
  .build();

export const swaggerCustomOptions: SwaggerCustomOptions = {
  jsonDocumentUrl: 'swagger/json',
};