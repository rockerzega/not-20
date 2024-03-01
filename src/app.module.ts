import { APP_PIPE } from '@nestjs/core';
import { AppService } from './app.service';
import { UserModule } from './users/user.module';
import { AuthModule } from './auth/auth.module';
import { AppController } from './app.controller';
import { MongooseModule } from '@nestjs/mongoose';
import MongoConfig from './configs/mongo.configs';
import { SocketModule } from './socket/socket.module';
import { ProjectsModule } from './projects/projects.module';
import { AuthMiddleware } from 'src/middleware/auth-middleware';
import { PushUsersModule } from './push-users/push-users.module';
import { NotificationModule } from './notifications/notification.module';
import { AuthMiddlewareService } from 'src/middleware/auth-middleware.service';
import { MiddlewareConsumer, Module, RequestMethod, ValidationPipe } from '@nestjs/common';


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
  providers: [AppService, AuthMiddlewareService, { provide: APP_PIPE, useClass: ValidationPipe }],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .exclude({ path: 'auth/login', method: RequestMethod.POST })
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
