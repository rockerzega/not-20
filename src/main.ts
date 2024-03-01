import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpErrorMiddleware } from './middleware/error-middleware';
import cookie from '@fastify/cookie';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { MongoIoAdapter } from './socket/socket.ioAdapter';

declare module 'fastify' {
  interface FastifyRequest {
    payload?: any;
  }
}
async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
    {
      // logger: false,
    },
  );
  const mongoAdapter = new MongoIoAdapter(app);
  await mongoAdapter.connectToMongo();
  app.useWebSocketAdapter(mongoAdapter);
  app.register(cookie);
  app.useGlobalFilters(new HttpErrorMiddleware());
  const PORT = process.env.PORT || 5000;
  await app.listen(PORT);
  console.log(`Application is running on port: ${PORT}`);
}
bootstrap();
