import { Injectable } from '@nestjs/common';
import { CreatePushUserDto } from './dto/create-push-user.dto';
import { UpdatePushUserDto } from './dto/update-push-user.dto';

@Injectable()
export class PushUsersService {
  create(createPushUserDto: CreatePushUserDto) {
    return 'This action adds a new pushUser';
  }

  findAll() {
    return `This action returns all pushUsers`;
  }

  findOne(id: number) {
    return `This action returns a #${id} pushUser`;
  }

  update(id: number, updatePushUserDto: UpdatePushUserDto) {
    return `This action updates a #${id} pushUser`;
  }

  remove(id: number) {
    return `This action removes a #${id} pushUser`;
  }
}
