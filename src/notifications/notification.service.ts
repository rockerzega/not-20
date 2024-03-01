import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { msqTemporalOptions } from 'src/libs/utils';
import mongooseSmartQuery from 'mongoose-smart-query';
import { CreateNotificationDto } from './dto/create-notification.dto';
import Notification, { NotificationModel } from './notification.model';

Notification.plugin(mongooseSmartQuery, {
  defaultFields: '_id',
  defaultSort: '-createdAt',
  fieldsForDefaultQuery: 'id proyecto eliminar args datos revisado',
  ...msqTemporalOptions,
});

@Injectable()
export class NotificationService {
  constructor(
    @InjectModel('notificaciones')
    public readonly modelNotificacion: NotificationModel,
  ) {}

  async find(query: Record<string, any>) {
    if (query._id) {
      const [notification] = await this.modelNotificacion.smartQuery(query);
      if (!notification) {
        throw new BadRequestException({
          info: { typeCode: 'NotFound' },
          message: 'No se encontraró la notificación',
        });
      }
      return notification;
    }
    const data = await this.modelNotificacion.smartQuery(query);
    return {
      data,
      total: await this.modelNotificacion.smartCount(query),
      page: parseInt(query.page || '1'),
    };
  }

  async create(body: CreateNotificationDto) {
    const createdNotificacion = new this.modelNotificacion(body);
    return await createdNotificacion.save();
  }

  async findOne(id: string | object) {
    if(typeof id === 'string') {
      return await this.modelNotificacion.findById(id);
    }
    return (await this.modelNotificacion.find(id))[0];
  }

  async aggregate(query: any) {
    return await this.modelNotificacion.aggregate(query);
  }

  async deleteOne(query: any) {
    return await this.modelNotificacion.deleteOne(query);
  }
}
