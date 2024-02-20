import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import Entidad, { IEntidad, EntidadDocument } from './user.model';
import { Model } from 'mongoose';
import mongooseSmartQuery from 'mongoose-smart-query';
import { hashear, msqTemporalOptions } from 'src/libs/utils';

Entidad.plugin(mongooseSmartQuery, {
  defaultFields: '_id',
  defaultSort: '-createdAt',
  fieldsForDefaultQuery: 'id nombre usuario mail proyecto admin',
  ...msqTemporalOptions,
});

Entidad.statics.auth = async function (data) {
  const { usuario } = data;
  const password = hashear(data.password);
  const existentes = await this.countDocuments({ usuario });
  if (existentes < 1) {
    throw new NotFoundException(
      {
        info: { typeCode: 'OperatorNotFound', id: data.usuario },
      },
      `No se encontró el operador: ${data.usuario}`,
    );
  }
  const operador = await this.findOne({ usuario, password });
  if (!operador) {
    throw new BadRequestException(
      {
        info: { typeCode: 'BadPassword' },
      },
      'La contraseña es incorrecta',
    );
  }
  return operador;
};

@Injectable()
export class UsersService {
  constructor(
    @InjectModel('entidades')
    private readonly userModel: Model<EntidadDocument, IEntidad>,
  ) {}

  async find(query: Record<string, any>) {
    return await this.userModel.smartQuery(query);
  }

  async create(body: any) {
    const createdUser = new this.userModel(body);
    return await createdUser.save();
  }

  async findOne(id: string) {
    return await this.userModel.findById(id);
  }
}
