import { deepmerge } from 'src/libs/utils';
import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import {
  BadRequestException,
  Controller,
  Get,
  Param,
  Query,
  Post,
  Body,
  Put,
  Req,
} from '@nestjs/common';

@Controller('proyectos')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}
  @Get()
  findAll(@Query() query: any, @Req() req: any) {
    return this.projectsService.find(query, req.raw.payload);
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Query() query: any, @Req() req: any) {
    query._id = id;
    const project = await this.projectsService.find(query, req.raw.payload);
    if (!project) {
      throw new BadRequestException({
        info: { typeCode: 'NotFound' },
        message: 'No se encontraron los parámetros de la petición',
      });
    }
    return project;
  }

  @Post()
  async create(@Body() body: CreateProjectDto) {
    // Validamos que los campos requeridos se encuentren
    if (!body.nombre || !body.usuario || !body.password || !body.proyecto) {
      throw new BadRequestException({
        info: { typeCode: 'NotData' },
        message: 'Favor de enviar los datos completos',
      });
    }
    if (/\s/.test(body.usuario) || /\s/.test(body.password)) {
      throw new BadRequestException({
        info: { typeCode: 'WrongData' },
        message: 'El usuario y la contraseña no pueden contener espacios',
      });
    }
    return this.projectsService.create(body);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() body: UpdateProjectDto) {
    const project = await this.projectsService.findOne(id);
    if (!project) {
      throw new BadRequestException({
        info: { typeCode: 'NotFound' },
        message: 'No existe el proyecto a actualizar',
      });
    }
    if (body.oldPassword && body.oldPassword !== project.password) {
      throw new BadRequestException({
        info: { typeCode: 'Unauthorized' },
        message: 'La contraseña antigua es incorrecta',
      });
    }
    delete body.oldPassword;
    project.set(deepmerge(project.toObject(), body));
    if (project.isModified()) {
      (project as any).updateBy = 'user';
      await project.save();
    }
    return { message: 'Proyecto actualizado con éxito' };
  }

  @Get('get-options')
  async getOptions() {
    return this.projectsService.getOptions();
  }
  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.projectsService.remove(+id);
  // }
}
