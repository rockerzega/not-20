import { InjectModel } from '@nestjs/mongoose';
import {
  Project,
  ProjectSchema,
  ProjectDocument,
} from './entities/project.entity';
import mongooseSmartQuery from 'mongoose-smart-query';
import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';

ProjectSchema.plugin(mongooseSmartQuery, {
  defaultFields: '_id',
  defaultSort: '-_date',
  fieldsForDefaultQuery: 'user',
});

@Injectable()
export class ProjectsService {
  constructor(
    @InjectModel('proyectos')
    public readonly modelProject: Model<Project, ProjectDocument>,
  ) {}
  async findAll() {
    return this.modelProject.find();
  }
  async findOne(query: Record<string, any>) {
    return this.modelProject.smartQuery(query);
  }
}
