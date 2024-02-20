import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
@Catch()
export class HttpErrorMiddleware implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const context = host.switchToHttp();
    const response = context.getResponse<Response>();
    const request = context.getRequest<Request>();
    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;
    console.error({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
      message: exception.message,
      code:
        (exception.response && exception.response.error) ||
        'INTERNAL SERVER ERROR',
      typeCode:
        exception.response && exception.response.info
          ? exception.response.info.typeCode
          : undefined,
    });
    response.status(status).send({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
      message: exception.message,
      code:
        (exception.response && exception.response.error) ||
        'INTERNAL SERVER ERROR',
      typeCode:
        exception.response && exception.response.info
          ? exception.response.info.typeCode
          : undefined,
    });
  }
}
