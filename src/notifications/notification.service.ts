import { Injectable } from '@nestjs/common';
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
    public readonly modelProject: NotificationModel,
  ) {}

  async find(query: Record<string, any>) {
    return await this.modelProject.smartQuery(query);
  }

  async create(body: CreateNotificationDto) {
    const createdProject = new this.modelProject(body);
    return await createdProject.save();
  }

  async findOne(id: string) {
    return await this.modelProject.findById(id);
  }
}
