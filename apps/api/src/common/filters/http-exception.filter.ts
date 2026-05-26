import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { MulterError } from 'multer';
import { RESUME_VALIDATION_MESSAGES } from '../../files/files.messages';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    if (exception instanceof MulterError) {
      const multerBody = this.mapMulterError(exception);
      response.status(multerBody.statusCode).json(multerBody);
      return;
    }

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const message =
      exception instanceof HttpException
        ? exception.getResponse()
        : 'Internal server error';

    if (status >= HttpStatus.INTERNAL_SERVER_ERROR) {
      this.logger.error(
        `${request.method} ${request.url}`,
        exception instanceof Error ? exception.stack : String(exception),
      );
    }

    const body =
      typeof message === 'string'
        ? { statusCode: status, message }
        : { statusCode: status, ...(message as object) };

    response.status(status).json(body);
  }

  private mapMulterError(error: MulterError): {
    statusCode: number
    message: string
    errors: string[]
  } {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return {
        statusCode: HttpStatus.BAD_REQUEST,
        message: RESUME_VALIDATION_MESSAGES.maxSize,
        errors: [RESUME_VALIDATION_MESSAGES.maxSize],
      };
    }

    return {
      statusCode: HttpStatus.BAD_REQUEST,
      message: RESUME_VALIDATION_MESSAGES.required,
      errors: [error.message],
    };
  }
}
