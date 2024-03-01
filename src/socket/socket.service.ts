import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { NotificationService } from 'src/notifications/notification.service';
import { ICLient } from 'src/libs/interfaces-collection';

@Injectable()
export class SocketService {
  constructor(private readonly notificationService: NotificationService){}

  async Agregar(cliente: ICLient) {
    try {
      const { proyecto, id } = cliente;
      const args = cliente.args;
      const and: any = [
        {
          $or: [
            { $eq: ['$id', id] },
            { $eq: [{ $ifNull: ['$id', null] }, null] },
          ],
        },
      ];

      const cantidad = args ? Object.keys(args).length : 0;
      if (cantidad > 0) {
        Object.keys(args).forEach((key) => {
          and.push({
            $or: [
              { $eq: [`$args.${key}`, args[key]] },
              { $eq: [{ $ifNull: [`$args.${key}`, null] }, null] },
            ],
          });
        });
      }
      and.push({
        $or: [
          { $eq: [{ $ifNull: ['$fechaInicio', null] }, null] },
          { $lte: ['$fechaInicial', new Date()] },
        ],
      });
      const match: any = {
        proyecto,
        $expr: {
          $and: and,
        },
      };
      const total = (
        await this.notificationService.aggregate([{ $match: { ...match } }])
      ).length;
      const count = (
        await this.notificationService.aggregate([
          { $match: { ...match } },
          {
            $match: {
              revisado: false,
            },
          },
        ])
      ).length;
      return {
        total,
        count,
        match: [{ $match: { ...match } }],
      };
    } catch (error) {
      throw new BadRequestException({
        info: { typeCode: 'ErrorAddNotifications' },
        message: 'Error al agregar notificaciones',
      });
    }
  }

  async get(cliente: ICLient) {
    try {
      const limit = cliente.args?.limit || 20;
      const page = cliente.args?.page || 1;
      const sort = cliente.args?.latest || false;
      delete cliente.args?.limit;
      delete cliente.args?.page;
      delete cliente.args?.latest;
      const { total, count, match } = await this.Agregar(cliente);
      const aggregate: any[] = [...match];
      if (!sort) {
        aggregate.push({
          $sort: { createdAt: -1 },
        });
      }
      aggregate.push(
        {
          $skip: (page - 1) * limit,
        },
        {
          $limit: limit,
        },
      );
      const datos = await this.notificationService.aggregate(aggregate);
      return {
        datos,
        total,
        page,
        limit,
        count,
      };
    } catch (error) {
      throw new NotFoundException({
        info: { typeCode: 'ErrorObtainNotifications' },
        message: 'Error en la obtención de notificaciones',
      });
    }
  }

  async read(cliente): Promise<boolean> {
    try {
      delete cliente.args?.limit;
      delete cliente.args?.page;
      delete cliente.args?.latest;
      const { match } = await this.Agregar(cliente);
      const notificaciones = await this.notificationService.aggregate([
        ...match,
        {
          $match: {
            revisado: false,
            eliminar: true,
          },
        },
      ]);
      if (notificaciones.length === 0) {
        return false;
      }
      await Promise.all(
        notificaciones.map(async (notificacion) => {
          const not = await this.notificationService.findOne(
            {
              _id: notificacion._id,
            },
          );
          not.revisado = true;
          await not.save();
        }),
      );
      return true;
    } catch (err) {
      throw new BadRequestException({
        info: { typeCode: 'ErrorReadNotifications' },
        message: 'Error al marcar como leidas las notificaciones',
      });
    }
  }

  async updateNotification(cliente: any) {
    try {
      const not = await this.notificationService.findOne({
        _id: cliente._id,
        id: cliente.id,
        eliminar: true,
      });
      if (!not) {
        throw new BadRequestException({
          info: { typeCode: 'NotFound' },
          message: 'No se encontraró la notificación',
        });
      }
      not.revisado = true;
      await not.save();
    } catch (error) {
      throw new BadRequestException({
        info: { typeCode: 'ErrorUpdateNotifications' },
        message: 'Error al marcar como leidas las notificaciones',
      });
    }
  }

  async deleteNotification(cliente: any) {
    try {
      const not = await this.notificationService.deleteOne({
        _id: cliente._id,
        id: cliente.id,
        eliminar: true,
      });
    } catch (error) {
      throw new BadRequestException({
        info: { typeCode: 'ErrorDeleteNotifications' },
        message: 'Error al eliminar las notificaciones',
      });
    }
  }

  async deleteAll(cliente: any) {
    try {
      delete cliente.args?.limit
      delete cliente.args?.page
      delete cliente.args?.latest
      const { match } = await this.Agregar(cliente)
      const notificaciones = await this.notificationService.aggregate([
        ...match,
        {
          $match: {
            revisado: true,
            eliminar: true,
          },
        },
      ])
      if (notificaciones.length  === 0) {
        return false
      }
      await Promise.all(
        notificaciones.map(async (notificacion) => {
          await this.notificationService.deleteOne({ _id: notificacion._id })
        })
      )
    } catch (error) {
      throw new BadRequestException({
        info: { typeCode: 'ErrorDeleteAllNotifications' },
        message: 'Error al eliminar las notificaciones',
      })
    }
  }
}