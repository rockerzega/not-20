import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersService } from './user.service';
import { UsersController } from './user.controller';
import User from './user.model';
@Module({
  imports: [MongooseModule.forFeature([{ name: 'entidades', schema: User }])],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UserModule {}
