import { masterKey, secret } from 'src/configs/app.configs';
import {
  Post,
  Body,
  Controller,
  BadRequestException,
  Query,
} from '@nestjs/common';
import { UsersService } from 'src/users/user.service';
import * as dayjs from 'dayjs';
import { encode } from 'jwt-simple';

function crearToken(data: any, longTime: boolean = false): string {
  console.log('flag1');
  const expiration = longTime
    ? dayjs().add(10, 'years').toISOString()
    : dayjs().add(1, 'day').toISOString();
  console.log('flag2');
  const payload = {
    ...data,
    date: dayjs().toISOString(),
    endDate: expiration,
  };
  return encode(payload, secret);
}

@Controller('auth')
export class AuthController {
  constructor(private readonly userService: UsersService) {}
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
}
