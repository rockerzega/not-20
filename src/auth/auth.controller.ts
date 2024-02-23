import * as dayjs from 'dayjs';
import { resolve } from 'path';
import { readFileSync } from 'fs';
import { encode } from 'jwt-simple';
import { FastifyRequest } from 'fastify';
import { AuthService } from './auth.services';
import { UsersService } from 'src/users/user.service';
import { masterKey, secret } from 'src/configs/app.configs';
import {
  Get,
  Req,
  Post,
  Body,
  Query,
  Controller,
  BadRequestException,
} from '@nestjs/common';

function crearToken(data: any, longTime: boolean = false): string {
  const expiration = longTime
    ? dayjs().add(10, 'years').toISOString()
    : dayjs().add(1, 'day').toISOString();
  const payload = {
    ...data,
    date: dayjs().toISOString(),
    endDate: expiration,
  };
  return encode(payload, secret);
}

@Controller('auth')
export class AuthController {
  constructor(
    private readonly userService: UsersService,
    private readonly authService: AuthService,
  ) {}
  @Post('login')
  async login(@Body() body: any, @Query('master') master: string) {
    if (body?.longTime && typeof body.longTime !== 'boolean') {
      throw new BadRequestException({
        info: { typeCode: 'WrongData' },
        message: 'longTime incorrecto',
      });
    }
    const longTime = body?.longTime || false;
    const user = await this.userService.auth(body);
    const data: any = {
      id: user.id,
      nombre: user.nombre,
      admin: user.admin,
      proyecto: user.proyecto ? user.proyecto : null,
      usuario: user.usuario,
      master: master === masterKey || (!user.proyecto && user.admin),
    };
    if (user.proyecto) {
      data.proyecto = user.proyecto;
    }
    return { ...data, token: crearToken(data, longTime) };
  }
  @Get()
  async validate(@Req() req: FastifyRequest) {
    console.log('en el get auth', req.headers);
    const payload = this.authService.getPayload(req);
    const data: any = {
      id: payload.id,
      nombre: payload.nombre,
      admin: payload.admin,
      proyecto: payload.proyecto,
      validoDesde: dayjs(payload.date),
      validoHasta: payload.endDate,
      master: payload.master,
    };
    if (payload.proyecto) {
      data.proyecto = payload.proyecto;
    }
    data.modules = JSON.parse(
      readFileSync(resolve(`src/assets/modules.json`), 'utf8'),
    );
    if (!data.admin) {
      data.modules.splice(0, 1);
    } else if (!payload.master) {
      data.modules.forEach((item) => {
        if (item.key === 'admin') {
          item.submodules = item.submodules.filter(
            (item) => item.key !== 'proyectos',
          );
        }
      });
    }
    return data;
  }
}
