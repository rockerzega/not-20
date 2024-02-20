import { APP_PIPE } from '@nestjs/core';
import { AppService } from './app.service';
import { UserModule } from './users/user.module';
import { AppController } from './app.controller';
import { MongooseModule } from '@nestjs/mongoose';
import MongoConfig from './configs/mongo.configs';
import { SocketModule } from './socket/socket.module';
import { Module, ValidationPipe } from '@nestjs/common';
import { ProjectsModule } from './projects/projects.module';
import { OperadoresModule } from './operadores/operadores.module';

@Module({
  imports: [
    SocketModule,
    OperadoresModule,
    ProjectsModule,
    UserModule,
    MongooseModule.forRoot(MongoConfig.databaseURI),
  ],
  controllers: [AppController],
  providers: [AppService, { provide: APP_PIPE, useClass: ValidationPipe }],
})
export class AppModule {}
