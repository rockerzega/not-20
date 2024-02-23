import * as dayjs from 'dayjs';
import { decode } from 'jwt-simple';
import { secret } from 'src/configs/app.configs';
import { BadRequestException, Injectable } from '@nestjs/common';

@Injectable()
export class AuthMiddlewareService {
  validateToken(token: string) {
    let payload: any;
    try {
      payload = decode(token, secret);
    } catch (e) {
      throw new BadRequestException({
        info: { typeCode: 'InvalidToken' },
        message: 'Error al decodificar el token',
      });
    }
    if (payload.endDate) {
      const minutes = dayjs(payload.endDate).diff(new Date());
      if (minutes < 0) {
        throw new BadRequestException({
          info: { typeCode: 'ExpiredToken' },
          message: 'El token ha expirado',
        });
      }
      payload.endDate = new Date(payload.endDate).toISOString();
    }
    return payload;
  }
}
