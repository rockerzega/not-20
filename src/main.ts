import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpErrorMiddleware } from './libs/error-middleware';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
    {
      // logger: false,
    },
  );
  app.useGlobalFilters(new HttpErrorMiddleware());
  await app.listen(process.env.PORT || 5000);
  console.log(`Application is running on port: ${process.env.PORT || 5000}`);
}
bootstrap();
