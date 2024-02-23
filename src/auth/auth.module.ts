import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { UserModule } from 'src/users/user.module';
import { AuthService } from './auth.services';

@Module({
  imports: [UserModule],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
