// src/shared/decorators/api-swagger.decorator.ts

import { applyDecorators } from "@nestjs/common";
import {
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiConsumes,
  ApiBody,
  ApiQuery,
  ApiTags,
} from "@nestjs/swagger";

interface ApiSwaggerOptions {
  summary: string;
  bodyType?: any;
  consumes?: string;
  responses?: { status: number; description: string }[];
  tags?: string[];
  bearerAuth?: boolean;
  queryParams?: { name: string; required: boolean; example: any }[];
}

export function ApiSwagger(options: ApiSwaggerOptions) {
  const decorators: (MethodDecorator | ClassDecorator)[] = [];

  if (options.tags?.length) {
    decorators.push(ApiTags(...options.tags));
  }

  if (options.bearerAuth !== false) {
    decorators.push(ApiBearerAuth());
  }

  decorators.push(ApiOperation({ summary: options.summary }));

  if (options.bodyType) {
    decorators.push(ApiBody({ type: options.bodyType }));
  }

  if (options.consumes) {
    decorators.push(ApiConsumes(options.consumes));
  }

  // Aplicar parámetros de consulta si se pasan
  if (options.queryParams?.length) {
    for (const param of options.queryParams) {
      decorators.push(ApiQuery(param));
    }
  }

  if (options.responses?.length) {
    for (const resp of options.responses) {
      decorators.push(ApiResponse(resp));
    }
  }

  return applyDecorators(...decorators);
}

export function ApiTagsDecorator(tags: string[]) {
  return applyDecorators(ApiTags(...tags));
}
