import { Model, Document, Schema } from 'mongoose';
import { uniqueDocValidator } from 'src/libs/utils';

export interface IProject extends Document {
  proyecto: string;
  nombre: string;
  usuario: string;
  password: string;
  descripcion?: string;
  opciones?: string;
}

const Project = new Schema<IProject>(
  {
    proyecto: {
      required: true,
      type: String,
      validate: uniqueDocValidator(
        'proyecto',
        'Ya existe un proyecto con ese nombre',
      ),
    },
    nombre: {
      required: true,
      type: String,
    },
    usuario: {
      required: true,
      type: String,
    },
    password: {
      required: true,
      type: String,
    },
    descripcion: {
      required: false,
      type: String,
    },
    opciones: {
      required: false,
      type: String,
    },
  },
  { timestamps: true },
);

export type ProjectDocument = IProject & Document;
export type ProyectoModel = Model<ProjectDocument, IProject>;
export default Project;
