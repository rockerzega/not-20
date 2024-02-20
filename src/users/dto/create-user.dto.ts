// import { model } from 'mongoose';
// import { IsUnique } from 'src/libs/validators';
// import Entidad from '../user.model';
import {
  IsAlpha,
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsOptional,
} from 'class-validator';

// const entidadModel = model('entidades', Entidad);

export class CreateUserDto {
  @IsAlpha()
  @IsNotEmpty()
  readonly id: string;

  @IsAlpha()
  @IsNotEmpty()
  readonly nombre: string;

  @IsAlpha()
  @IsNotEmpty()
  readonly usuario: string;

  @IsAlpha()
  @IsNotEmpty()
  readonly password: string;

  @IsEmail(undefined, { message: 'El correo no es válido' })
  readonly mail: string;

  @IsAlpha()
  @IsOptional()
  readonly proyecto?: string;

  @IsAlpha()
  @IsOptional()
  readonly telf?: string;

  @IsBoolean()
  @IsOptional()
  readonly admin?: string;
}
