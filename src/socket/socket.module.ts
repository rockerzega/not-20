import { Module } from '@nestjs/common';
import { SocketGateway } from './socket.gateway';
import { NotificationModule } from 'src/notifications/notification.module';
import { SocketService } from './socket.service';

@Module({
  providers: [SocketGateway, SocketService],
  imports: [NotificationModule],
})
export class SocketModule {}
