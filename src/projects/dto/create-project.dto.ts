import { Matches, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateProjectDto {
  @IsString()
  @Matches(/^[a-zA-Z-]+$$/)
  @IsNotEmpty()
  readonly proyecto: string;

  @IsString()
  readonly nombre: string;

  @IsString()
  @Matches(/^[a-zA-Z-]+$$/)
  readonly usuario: string;

  @IsString()
  readonly password: string;

  @IsString()
  @IsOptional()
  readonly descripcion?: string;

  @IsString()
  @IsOptional()
  readonly opciones?: string;
}
