import { removeEmpty, existeID } from 'src/libs/utils';
import { Model, SchemaTypes, Document, Schema } from 'mongoose';

export interface INotification extends Document {
  id?: string;
  proyecto: string;
  eliminar?: boolean;
  args?: { [x: string]: string | number | boolean | object };
  datos: { [x: string]: string | number | boolean | object };
  revisado: boolean;
  fechaInicio?: Date;
  fechaFin?: Date;
}
const Notification = new Schema<INotification>(
  {
    id: { type: String, set: removeEmpty },
    proyecto: {
      type: String,
      required: true,
      validate: existeID('Verificar las fechas'),
    },
    eliminar: { type: Boolean, set: removeEmpty },
    args: { type: Map, of: SchemaTypes.Mixed, set: removeEmpty },
    datos: { type: Map, of: SchemaTypes.Mixed, required: true },
    revisado: { type: Boolean, required: true, default: false },
    fechaInicio: { type: Date, set: removeEmpty },
    fechaFin: { type: Date, set: removeEmpty },
  },
  { timestamps: true },
);

export type NotificationDocument = INotification & Document;
export type NotificationModel = Model<Document, INotification>;
export default Notification;
