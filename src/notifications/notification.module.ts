import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { NotificationService } from './notification.service';
import { NotificationController } from './notification.controller';
import Notification from './notification.model';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'notificaciones', schema: Notification },
    ]),
  ],
  controllers: [NotificationController],
  providers: [NotificationService],
})
export class NotificationModule {}
