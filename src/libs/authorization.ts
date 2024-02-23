import dayjs from 'dayjs';
// import Debug from 'debug';
import { decode } from 'jwt-simple';
import { entidadToken, secret } from 'src/configs/app.configs';
import { FastifyRequest } from 'fastify';
import { BadRequestException } from '@nestjs/common';

// const debug = Debug('api:libs:autorizacion');

/**
 * Obtiene el token de la petición http.
 * @param {Object} req - La petición del cliente.
 * @return {String} El token para autorización.
 * @throws Si no se proporcionó el token.
 */
function getToken(req: FastifyRequest): string {
  const token =
    req.headers.authorization?.split(' ')[1] ||
    req.headers[entidadToken].toString();
  if (!token) {
    throw new BadRequestException({
      info: { typeCode: 'NoToken' },
      message: 'No se proporcionó el token',
    });
  }
  // debug('obtenido el token');
  return token;
}

/**
 * Obtiene el token y despues lo decodifica para obtener su payload.
 * @param {Object} req - La petición del usuario.
 * @return {Object} El payload.
 * @throws Si no se pudo decodificar el token se lanzará un error.
 * @throws Si el token ha caducado.
 */
export function getPayload(req: FastifyRequest): any {
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

export async function Middleware(req: any, res: any, next: any) {
  try {
    if (req.path().includes('/get-options')) {
      return next();
    }
    const payload = getPayload(req);
    req.payload = payload;
    next();
  } catch (err) {
    next(err);
  }
}
