import { Module } from '@nestjs/common';
import { PushUsersService } from './push-users.service';
import { PushUsersController } from './push-users.controller';

@Module({
  controllers: [PushUsersController],
  providers: [PushUsersService],
})
export class PushUsersModule {}
