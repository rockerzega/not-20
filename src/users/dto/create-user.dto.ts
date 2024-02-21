import {
  IsAlpha,
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsOptional,
} from 'class-validator';

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
