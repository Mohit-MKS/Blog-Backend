import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message: unknown = 'Internal server error';

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const res = exception.getResponse();
      if (typeof res === 'string') {
        message = res;
      } else if (typeof res === 'object' && res !== null) {
        const obj = res as Record<string, unknown>;
        message = obj.message || obj.error || message;
      }
    } else if (exception instanceof Error) {
      message = exception.message;
      const customException = exception as Error & { code?: number };
      if (customException.code && typeof customException.code === 'number') {
        status = customException.code;
      }
    }

    // Match express notFound controller for unmatched routes
    if (
      status === HttpStatus.NOT_FOUND &&
      typeof message === 'string' &&
      message.startsWith('Cannot ')
    ) {
      message = 'Api Not Found';
    }

    const isDevelopment =
      process.env.NODE_ENV === 'development' ||
      process.env.NODE_ENV === 'local';

    const responseBody: Record<string, unknown> = {
      code: status,
      status: false,
      message,
    };

    if (isDevelopment && exception instanceof Error && exception.stack) {
      responseBody.stack = exception.stack;
    }

    this.logger.error(
      `${request.method} ${request.url} [${status}]: ${
        typeof message === 'object' ? JSON.stringify(message) : String(message)
      }`,
    );

    response.status(status).json(responseBody);
  }
}
