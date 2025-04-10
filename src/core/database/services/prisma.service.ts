import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  private readonly logger = new Logger(PrismaService.name); // Logger para este servicio

  async onModuleInit() {
    try {
      await this.$connect();
      this.logger.log('Connected to the database successfully'); // Log cuando se conecta a la base de datos
    } catch (error) {
      this.logger.error('Failed to connect to the database', error.stack); // Log si hay error de conexión
    }
  }
}