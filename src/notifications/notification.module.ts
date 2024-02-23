import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { NotificationService } from './notification.service';
import { NotificationController } from './notification.controller';
import Notification from './notification.model';
import { ProjectsModule } from 'src/projects/projects.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'notificaciones', schema: Notification },
    ]),
    ProjectsModule,
  ],
  controllers: [NotificationController],
  providers: [NotificationService],
})
export class NotificationModule {}
