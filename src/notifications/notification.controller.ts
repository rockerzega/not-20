import { NotificationService } from './notification.service';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import {
  Get,
  Put,
  Post,
  Body,
  Param,
  Query,
  Controller,
  BadRequestException,
} from '@nestjs/common';
import { deepmerge } from 'src/libs/utils';

@Controller('notifications')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}
  @Get()
  findAll(@Query() query: any) {
    return this.notificationService.find(query);
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Query() query: any) {
    query._id = id;
    const [notification] = await this.notificationService.find(query);
    if (!notification) {
      throw new BadRequestException({
        info: { typeCode: 'NotFound' },
        message: 'No se encontraron los parámetros de la petición',
      });
    }
    return notification;
  }

  @Post()
  async create(@Body() body: CreateNotificationDto) {
    return this.notificationService.create(body);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() body: UpdateNotificationDto) {
    const notification = await this.notificationService.findOne(id);
    if (!notification) {
      throw new BadRequestException({
        info: { typeCode: 'NotFound' },
        message: 'No existe la notificación',
      });
    }
    notification.set(deepmerge(notification.toObject(), body));
    if (notification.isModified()) {
      (notification as any).updateBy = 'user';
      await notification.save();
    }
    return { message: 'Notificación actualizada con éxito' };
  }
}
