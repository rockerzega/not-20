import { FastifyReply } from 'fastify';
import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
@Catch()
export class HttpErrorMiddleware implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const context = host.switchToHttp();
    const response = context.getResponse<FastifyReply>();
    const request = context.getRequest<Request>();
    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;
    console.log('exception', exception);
    const rmessage =
      (Array.isArray(exception.response?.message) &&
        exception.response?.message?.join(', ')) ||
      undefined;
    const resumeError = {
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
      message: rmessage || exception.message,
      code:
        (exception.response && exception.response.error) ||
        'INTERNAL SERVER ERROR',
      typeCode:
        exception.response && exception.response.info
          ? exception.response.info.typeCode
          : rmessage
            ? 'ValidationException'
            : undefined,
    };
    console.error(resumeError);
    response.status(status).send(resumeError);
  }
}
