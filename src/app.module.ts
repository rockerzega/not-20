import { APP_PIPE } from '@nestjs/core';
import { AppService } from './app.service';
import { UserModule } from './users/user.module';
import { AuthModule } from './auth/auth.module';
import { AppController } from './app.controller';
import { MongooseModule } from '@nestjs/mongoose';
import MongoConfig from './configs/mongo.configs';
import { SocketModule } from './socket/socket.module';
import { Module, ValidationPipe } from '@nestjs/common';
import { ProjectsModule } from './projects/projects.module';
import { PushUsersModule } from './push-users/push-users.module';
import { NotificationModule } from './notifications/notification.module';

@Module({
  imports: [
    AuthModule,
    UserModule,
    SocketModule,
    ProjectsModule,
    NotificationModule,
    MongooseModule.forRoot(MongoConfig.databaseURI),
    PushUsersModule,
  ],
  controllers: [AppController],
  providers: [AppService, { provide: APP_PIPE, useClass: ValidationPipe }],
})
export class AppModule {}
