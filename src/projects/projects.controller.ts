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
} from '@nestjs/common';

@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}
  @Get()
  findAll(@Query() query: any) {
    return this.projectsService.find(query);
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Query() query: any) {
    query._id = id;
    const [project] = await this.projectsService.find(query);
    if (!project) {
      throw new BadRequestException({
        info: { typeCode: 'NotFound' },
        message: 'No se encontraron los parámetros de la petición',
      });
    }
    return project;
  }

  @Post()
  create(@Body() body: CreateProjectDto) {
    // Validamos que los campos requeridos se encuentren
    console.log('Flag 1');
    if (!body.nombre || !body.usuario || !body.password || !body.proyecto) {
      throw new BadRequestException({
        info: { typeCode: 'NotData' },
        message: 'Favor de enviar los datos completos',
      });
    }
    console.log('Flag 2');
    if (/\s/.test(body.usuario) || /\s/.test(body.password)) {
      throw new BadRequestException({
        info: { typeCode: 'WrongData' },
        message: 'El usuario y la contraseña no pueden contener espacios',
      });
    }
    console.log('Flag 3');
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

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.projectsService.remove(+id);
  // }
}
