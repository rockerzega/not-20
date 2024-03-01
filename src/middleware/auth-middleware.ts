import { FastifyRequest, FastifyReply } from 'fastify';
import { AuthMiddlewareService } from './auth-middleware.service';
import {
  BadRequestException,
  Injectable,
  NestMiddleware,
} from '@nestjs/common';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private authService: AuthMiddlewareService) {}
  async use(
    req: FastifyRequest,
    res: FastifyReply,
    done: (error?: Error) => void,
  ) {
    const token = req.headers.authorization;
    if (token) {
      try {
        const payload = await this.authService.validateToken(token);
        req.payload = payload;
        done();
      } catch (error) {
        done(error);
      }
    } else {
      done(
        new BadRequestException({
          info: { typeCode: 'NoToken' },
          message: 'No se encontró el token',
        }),
      );
    }
  }
}
