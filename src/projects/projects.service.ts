import { InjectModel } from '@nestjs/mongoose';
import Project, { IProject, ProjectDocument } from './projects.model';
import mongooseSmartQuery from 'mongoose-smart-query';
import { Injectable } from '@nestjs/common';
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
    console.log('query', query);
    return await this.modelProject.smartQuery(query);
  }

  async create(body: CreateProjectDto) {
    const createdProject = new this.modelProject(body);
    return await createdProject.save();
  }

  async findOne(id: string) {
    return await this.modelProject.findById(id);
  }
}
