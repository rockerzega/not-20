import { Document } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class Project extends Document {
  @Prop({ required: true })
  proyecto: string;

  @Prop({ required: true })
  nombre: string;

  @Prop({ required: true })
  usuario: string;

  @Prop({ required: true })
  password: string;

  @Prop()
  descripcion?: string;

  @Prop()
  opciones?: string;
}

export type ProjectDocument = Project & Document;
export const ProjectSchema = SchemaFactory.createForClass(Project);
