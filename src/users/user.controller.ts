import { UsersService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import {
  Get,
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
    const [project] = await this.userService.find(query);
    if (!project) {
      throw new BadRequestException({
        info: { typeCode: 'NotFound' },
        message: 'No se encontraron los parámetros de la petición',
      });
    }
    return project;
  }

  @Post()
  async create(@Body() body: CreateUserDto) {
    return this.userService.create(body);
  }
}
