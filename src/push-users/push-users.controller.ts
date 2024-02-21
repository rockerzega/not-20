import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PushUsersService } from './push-users.service';
import { CreatePushUserDto } from './dto/create-push-user.dto';
import { UpdatePushUserDto } from './dto/update-push-user.dto';

@Controller('push-users')
export class PushUsersController {
  constructor(private readonly pushUsersService: PushUsersService) {}

  @Post()
  create(@Body() createPushUserDto: CreatePushUserDto) {
    return this.pushUsersService.create(createPushUserDto);
  }

  @Get()
  findAll() {
    return this.pushUsersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.pushUsersService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePushUserDto: UpdatePushUserDto) {
    return this.pushUsersService.update(+id, updatePushUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.pushUsersService.remove(+id);
  }
}
