import { Model, Document, Schema } from 'mongoose';
import { uniqueDocValidator, removeEmpty } from 'src/libs/utils';

export interface IEntidad extends Document {
  id: string;
  nombre: string;
  usuario: string;
  proyecto?: string;
  password: string;
  telf?: string;
  mail: string;
  admin?: boolean;
}

const Entidad = new Schema<IEntidad>(
  {
    id: {
      type: String,
      required: true,
      validate: uniqueDocValidator('id'),
    },
    nombre: { type: String, required: true },
    usuario: {
      type: String,
      required: true,
      validate: uniqueDocValidator(
        'usuario',
        'Ya existe un usuario con ese nombre',
      ),
    },
    proyecto: {
      type: String,
      set: removeEmpty,
    },
    password: { type: String, required: true },
    telf: { type: String, set: removeEmpty },
    mail: { type: String, required: true },
    admin: { type: Boolean, set: removeEmpty },
  },
  { timestamps: true },
);

export type EntidadDocument = IEntidad & Document;
export type EntidadModel = Model<Document, IEntidad>;
export default Entidad;
