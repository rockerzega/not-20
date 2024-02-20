import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersService } from './user.service';
import { UsersController } from './user.controller';
import Entidad from './user.model';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'entidades', schema: Entidad }]),
  ],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UserModule {}
