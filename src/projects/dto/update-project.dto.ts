import { PartialType } from '@nestjs/mapped-types';
import { CreateProjectDto } from './create-project.dto';

export class UpdateProjectDto extends PartialType(CreateProjectDto) {
  // Add the fields you want to update
  // proyecto: string;
  // nombre: string;
  // usuario: string;
  // password: string;
  // descripcion: string;
  // opciones: string;
  oldPassword: string;
}
