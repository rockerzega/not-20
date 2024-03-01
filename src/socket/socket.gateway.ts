import { WebSocketGateway, OnGatewayConnection, WebSocketServer, SubscribeMessage, MessageBody, ConnectedSocket, OnGatewayInit, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { SocketService } from './socket.service';
import { masterKey } from 'src/configs/app.configs';
import { BadRequestException } from '@nestjs/common';
import { getPathId } from 'src/libs/utils';

@WebSocketGateway()
export class SocketGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  private server: Server;

  constructor(private readonly socketService: SocketService) {}

  
  @SubscribeMessage('getNotifications')
  async getMeesages(@MessageBody() data: any, @ConnectedSocket() socket: Socket): Promise<void> {
    try {
      if (!data.proyecto || !data.id) {
        throw new Error('No se proporcionaron los datos necesarios');
      }
      const response = await this.socketService.get(data);
      socket.emit('obtenerNotificaciones', response);
    } catch (error) {
      console.log(error.message);
      socket.emit('fallida', new BadRequestException({
        info: { typeCode: 'NotData' },
        message: error.message,
      }));
    }
  }

  @SubscribeMessage('join')
  async joinRoom(
    @MessageBody() data: any,
    @ConnectedSocket() socket: Socket
  ): Promise<void> {
    try {
      if (!(data.proyecto && data.id)) {
        this.server.to(socket.id).emit(
          'fallido',
          new BadRequestException({
            info: { typeCode: 'NotData' },
            message: 'Falta la información para crear conexión',
          }),
        );
        return;
      }

      const lista = [data.id];
      let path = data.id;

      if (data.args) {
        const args = data.args;
        delete args.page;
        delete args.limit;
        delete args.latest;

        for (const property in args) {
          path = `${path}/${args[property]}`;
          lista.push(path);
        }
      }
      console.log('conectado a proyecto')
      socket.join(data.proyecto);

      for (const sala of lista) {
        console.log('logueado a sala ', sala)
        socket.join(sala);
      }

      socket.emit('logueado', true);
    } catch (error) {
      socket.emit('fallido', new BadRequestException(error));
    }
  }

  @SubscribeMessage('readNotification')
  async readNotification(@ConnectedSocket() socket: Socket, @MessageBody() data: any): Promise<void> {
    try {
      await this.socketService.updateNotification(data);
      socket.emit('recargar')
    } catch(error) {
      socket.emit('fallido', new BadRequestException(error));
    }
    finally {
      socket.emit('recargar')
    }
  }

  @SubscribeMessage('readAll')
  async readAll(@ConnectedSocket() socket: Socket, @MessageBody() data: any): Promise<void> {
    const client = getPathId(data);
    try {
      await this.socketService.read(data);
      socket.emit('recargar')
    } catch(error) {
      socket.emit('fallido', new BadRequestException(error));
    }
    finally {
      this.server.to(client).emit('recargar');
    }
  }

  @SubscribeMessage('deleteAll')
  async deleteAll(@ConnectedSocket() socket: Socket, @MessageBody() data: any): Promise<void> {
    const client = getPathId(data);
    try {
      await this.socketService.deleteAll(data);
    } catch(error) {
      socket.emit('fallido', new BadRequestException(error));
    }
    finally {
      this.server.to(client).emit('recargar')
    }
  }

  @SubscribeMessage('conteo')
  handleEvent(@MessageBody() data: string): void {
    if (data === masterKey)
      this.server.emit('total', this.server.sockets.sockets.size);
  }

  @SubscribeMessage('close')
  closeConnection(@ConnectedSocket() socket: Socket): void {
    socket.disconnect();
  }

  afterInit(server: Server) {
    console.log('Socket gateway initialized');
  }

  handleDisconnect(socket: Socket) {
    socket.disconnect()
    console.log(`Client disconnected: ${socket.id}`);
  }

  handleConnection(client: Socket, ...args: any[]) {
    console.log(`Client connected: ${client.id}`);
  }

  // Implement other Socket.IO event handlers and message handlers
}