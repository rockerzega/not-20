
import { IoAdapter } from '@nestjs/platform-socket.io';
import { ServerOptions } from 'socket.io';
import { DEVELOPMENT_ENV } from 'src/configs/app.configs';
import { createAdapter } from '@socket.io/mongo-adapter';
import { MongoClient } from 'mongodb';

const db: string = 'helpdesk';
const collection: string = DEVELOPMENT_ENV ? 'notificaciones-dev' : 'notificaciones';

export class MongoIoAdapter extends IoAdapter {
  private adapterConstructor: ReturnType<typeof createAdapter>;

  async connectToMongo(): Promise<void> {
    const pubClient = new MongoClient('mongodb://helpdesk:Zqb4M6gQppdsySoQe7VF'
    + '@34.135.75.208:48615,34.135.75.208:48616'
    + '/helpdesk?replicaSet=tocset-test&authSource=tocusers',
    {
    useUnifiedTopology: true,
    } as unknown);
    await pubClient.connect();
    const adapterCollection = pubClient.db(db).collection(collection);
    this.adapterConstructor = createAdapter(adapterCollection);
  }

  createIOServer(port: number, options?: ServerOptions): any {
    const server = super.createIOServer(port, options);
    server.adapter(this.adapterConstructor);
    return server;
  }
}
