import { model } from 'mongoose';
import { IsUnique } from 'src/libs/validators';
import { ProjectSchema } from '../entities/project.entity';
import { IsAlpha, IsEmail, IsNotEmpty, IsOptional } from 'class-validator';

const projectModel = model('proyectos', ProjectSchema);

export class CreateProjectDto {
  @IsAlpha()
  @IsUnique(projectModel, 'proyecto')
  @IsNotEmpty()
  readonly proyecto: string;

  @IsAlpha()
  readonly nombre: string;

  @IsEmail()
  correo: string;

  @IsAlpha()
  password: string;

  @IsOptional()
  descripcion?: string;

  @IsOptional()
  opciones?: string;
}
