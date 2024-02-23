import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ProjectsService } from './projects.service';
import { ProjectsController } from './projects.controller';
import Project from './projects.model';
import { AuthMiddleware } from 'src/middleware/auth-middleware';
import { AuthMiddlewareService } from 'src/middleware/auth-middleware.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'proyectos', schema: Project }]),
  ],
  exports: [ProjectsService],
  controllers: [ProjectsController],
  providers: [ProjectsService, AuthMiddlewareService],
})
export class ProjectsModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .forRoutes({ path: '/projects', method: RequestMethod.ALL });
  }
}
