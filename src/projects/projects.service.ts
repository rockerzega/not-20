import { InjectModel } from '@nestjs/mongoose';
import Project, { IProject, ProjectDocument } from './projects.model';
import mongooseSmartQuery from 'mongoose-smart-query';
import { BadRequestException, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { msqTemporalOptions } from 'src/libs/utils';
import { CreateProjectDto } from './dto/create-project.dto';

Project.plugin(mongooseSmartQuery, {
  defaultFields: '_id',
  defaultSort: '-createdAt',
  fieldsForDefaultQuery: 'proyecto nombre usuario',
  ...msqTemporalOptions,
});

@Injectable()
export class ProjectsService {
  constructor(
    @InjectModel('proyectos')
    public readonly modelProject: Model<IProject, ProjectDocument>,
  ) {}

  async find(query: Record<string, any>) {
    if (query._id) {
      console.log('Find ONE', query);
      const [project] = await this.modelProject.smartQuery(query);
      if (!project) {
        throw new BadRequestException({
          info: { typeCode: 'NotFound' },
          message: 'El proyecto que solicita, no existe',
        });
      }
      console.log('Project', project);
      project.opciones = JSON.parse(project.opciones || '{}');
      return project;
    }
    const data = await this.modelProject.smartQuery(query);
    return {
      data,
      total: await this.modelProject.smartCount(query),
      page: parseInt(query.page || '1'),
    };
  }

  async create(body: CreateProjectDto) {
    const createdProject = new this.modelProject(body);
    return await createdProject.save();
  }

  async findOne(id: string) {
    return await this.modelProject.findById(id);
  }

  async getOptions() {
    const opciones = await this.modelProject.smartQuery({
      fields: 'proyecto nombre',
    });
    return {
      proyectos: opciones.map((item) => ({
        value: item.nombre,
        label: item.proyecto,
      })),
    };
  }
}
