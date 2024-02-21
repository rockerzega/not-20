import { deepmerge } from 'src/libs/utils';
import { UsersService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import {
  Get,
  Put,
  Post,
  Body,
  Param,
  Query,
  Controller,
  BadRequestException,
} from '@nestjs/common';

@Controller('entities')
export class UsersController {
  constructor(private readonly userService: UsersService) {}
  @Get()
  findAll(@Query() query: any) {
    return this.userService.find(query);
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Query() query: any) {
    query._id = id;
    const [user] = await this.userService.find(query);
    if (!user) {
      throw new BadRequestException({
        info: { typeCode: 'NotFound' },
        message: 'No se encontraron los parámetros de la petición',
      });
    }
    return user;
  }

  @Post()
  async create(@Body() body: CreateUserDto) {
    return this.userService.create(body);
  }

  @Put(':id')
  async update(@Param() id: string, @Body() body: UpdateUserDto) {
    const user = await this.userService.findOne(id);
    if (!user) {
      throw new BadRequestException({
        info: { typeCode: 'NotFound' },
        message: 'No existe el usuario a actualizar',
      });
    }
    user.set(deepmerge(user.toObject(), body));
    if (user.isModified()) {
      (user as any).updateBy = 'user';
      await user.save();
    }
    return { message: 'Usuario actualizado con éxito' };
  }
}
