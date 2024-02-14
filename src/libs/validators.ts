import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@Injectable()
@ValidatorConstraint({ name: 'isUnique', async: true })
export class UniqueValidator implements ValidatorConstraintInterface {
  constructor(private readonly model: Model<any, any>) {}

  async validate(value: string, args: any): Promise<boolean> {
    const path = args.property;
    const filter: { [key: string]: any } = { [path]: value };

    if (args.hasOwnProperty('id')) {
      filter._id = { $ne: args.id };
    }

    const document = await this.model.findOne(filter).exec();
    return !document;
  }
}

export function IsUnique(
  model: Model<any, any>,
  property?: string,
): PropertyDecorator {
  return (target: any, propertyKey: string) => {
    const args = property ? { property, id: target._id } : {};
    return Reflect.metadata('validate', {
      name: 'isUnique',
      args,
      target: target,
      propertyKey: propertyKey,
    });
  };
}
