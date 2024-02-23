import { decode } from 'jwt-simple';
import { FastifyRequest } from 'fastify';
import * as dayjs from 'dayjs';
import { BadRequestException, Injectable } from '@nestjs/common';
import { entidadToken, secret } from 'src/configs/app.configs';

export interface Payload {
  id: string;
  nombre: string;
  admin: boolean;
  proyecto?: string;
  usuario: string;
  master: boolean;
  date: string;
  endDate: string;
}

/**
 * Obtiene el token de la petición http.
 * @param {Object} req - La petición del cliente.
 * @return {String} El token para autorización.
 * @throws Si no se proporcionó el token.
 */
function getToken(req: FastifyRequest): string {
  const token = req.headers.authorization || req.cookies[entidadToken];
  console.log('token', token);
  if (!token) {
    throw new BadRequestException({
      info: { typeCode: 'NoToken' },
      message: 'No se proporcionó el token',
    });
  }
  return token;
}

@Injectable()
export class AuthService {
  /**
   * Obtiene el token y despues lo decodifica para obtener su payload.
   * @param {Object} req - La petición del usuario.
   * @return {Object} El payload.
   * @throws Si no se pudo decodificar el token se lanzará un error.
   * @throws Si el token ha caducado.
   */
  getPayload(req: FastifyRequest): Payload {
    let payload: any;
    const token = getToken(req);
    try {
      payload = decode(token, secret);
    } catch (e) {
      throw new BadRequestException({
        message: 'Error al decodificar el token',
        info: { typeCode: 'InvalidToken' },
      });
    }
    if (payload.endDate) {
      const minutes = dayjs(payload.endDate).diff(new Date());
      if (minutes < 0) {
        throw new BadRequestException({
          message: 'El token ha expirado',
          info: { typeCode: 'ExpiredToken' },
        });
      }
      payload.endDate = new Date(payload.endDate).toISOString();
    }
    return payload;
  }
}
