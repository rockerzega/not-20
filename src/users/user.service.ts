import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import User, { UserModel } from './user.model';
import mongooseSmartQuery from 'mongoose-smart-query';
import { hashear, msqTemporalOptions } from 'src/libs/utils';

User.plugin(mongooseSmartQuery, {
  defaultFields: '_id',
  defaultSort: '-createdAt',
  fieldsForDefaultQuery: 'id nombre usuario mail proyecto admin',
  ...msqTemporalOptions,
});

User.statics.auth = async function (data) {
  const { usuario } = data;
  const password = hashear(data.password);
  const existentes = await this.countDocuments({ usuario });
  if (existentes < 1) {
    throw new NotFoundException({
      info: { typeCode: 'OperatorNotFound', id: data.usuario },
      message: `No se encontró el operador: ${data.usuario}`,
    });
  }
  const operador = await this.findOne({ usuario, password });
  if (!operador) {
    throw new BadRequestException({
      info: { typeCode: 'BadPassword' },
      message: 'La contraseña es incorrecta',
    });
  }
  return operador;
};

@Injectable()
export class UsersService {
  constructor(
    @InjectModel('entidades')
    private readonly userModel: UserModel,
  ) {}

  async find(query: Record<string, any>) {
    if (query._id) {
      const [user] = await this.userModel.smartQuery(query);
      if (!user) {
        throw new NotFoundException({
          info: { typeCode: 'NotFound' },
          message: 'El usuario que solicita, no existe',
        });
      }
      return user;
    }
    const data = await this.userModel.smartQuery(query);
    return {
      data,
      total: await this.userModel.smartCount(query),
      page: parseInt(query.page || '1'),
    };
  }

  async getone(query: Record<string, any>) {
    return await this.userModel.getOne(query);
  }

  async create(body: any) {
    const createdUser = new this.userModel(body);
    return await createdUser.save();
  }

  async findOne(id: string) {
    return await this.userModel.findById(id);
  }

  async count(data: any) {
    return await this.userModel.smartCount(data);
  }

  async auth(data: any) {
    const { usuario } = data;
    const password = hashear(data.password);
    const existentes = await this.userModel.countDocuments({ usuario });
    if (existentes < 1) {
      throw new NotFoundException({
        info: { typeCode: 'OperatorNotFound', id: data.usuario },
        message: `No se encontró el operador: ${data.usuario}`,
      });
    }
    const operador = await this.userModel.findOne({ usuario, password });
    if (!operador) {
      throw new BadRequestException({
        info: { typeCode: 'BadPassword' },
        message: 'La contraseña es incorrecta',
      });
    }
    return operador;
  }
}
