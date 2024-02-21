import { Model, Document, Schema } from 'mongoose';
import { uniqueDocValidator, removeEmpty } from 'src/libs/utils';

export interface IUser extends Document {
  id: string;
  nombre: string;
  usuario: string;
  proyecto?: string;
  password: string;
  telf?: string;
  mail: string;
  admin?: boolean;
}

const User = new Schema<IUser>(
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

User.statics.saludo = () => {
  console.log('Hola');
};

export type UserDocument = IUser & Document;
export type UserModel = Model<Document, IUser>;
export default User;
