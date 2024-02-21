import { AuthService } from './auth-middleware.service';
import { FastifyRequest, FastifyReply } from 'fastify';
import {
  BadRequestException,
  Injectable,
  NestMiddleware,
} from '@nestjs/common';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private authService: AuthService) {}
  async use(
    req: FastifyRequest,
    res: FastifyReply,
    done: (error?: Error) => void,
  ) {
    console.log('req.headers', req.headers);
    const token = req.headers.authorization?.split(' ')[1];
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
