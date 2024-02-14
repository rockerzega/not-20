import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SocketModule } from './socket/socket.module';
import { OperadoresModule } from './operadores/operadores.module';
import { ProjectsModule } from './projects/projects.module';
import { MongooseModule } from '@nestjs/mongoose';
import MongoConfig from './configs/mongo.configs';

@Module({
  imports: [
    SocketModule,
    OperadoresModule,
    ProjectsModule,
    MongooseModule.forRoot(MongoConfig.databaseURI),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
