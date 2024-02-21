import {
  Matches,
  IsString,
  IsObject,
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsDateString,
} from 'class-validator';

export class CreateNotificationDto {
  @IsString()
  @Matches(/^[a-zA-Z-]+$$/)
  @IsNotEmpty()
  readonly proyecto: string;

  @IsObject()
  @IsNotEmpty()
  readonly datos: object;

  @IsBoolean()
  revisado: boolean;

  @IsString()
  @IsOptional()
  readonly id: string;

  @IsObject()
  @IsOptional()
  readonly args: object;

  @IsBoolean()
  @IsOptional()
  readonly eliminar: boolean;

  @IsDateString()
  @IsOptional()
  readonly fechaInicio: Date;

  @IsDateString()
  @IsOptional()
  readonly fechaFin: Date;
}
