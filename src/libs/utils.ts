import * as crypto from 'node:crypto';
import { deepmergeCustom, DeepMergeLeafURI } from 'deepmerge-ts';
import { BadRequestException } from '@nestjs/common';
import { ICLient } from './interfaces-collection';

export const deepmerge = deepmergeCustom<{
  DeepMergeArraysURI: DeepMergeLeafURI;
}>({
  mergeArrays: false,
});

export const msqTemporalOptions = {
  pageQueryName: 'page',
  limitQueryName: 'limit',
  fieldsQueryName: 'fields',
  sortQueryName: 'sort',
  queryName: 'q',
  allFieldsQueryName: 'getAllFields',
  defaultLimit: 10,
};

export function uniqueDocValidator(fields: any, message?: string) {
  const paths = typeof fields === 'string' ? [fields] : fields;
  return {
    async validator() {
      const query = { _id: { $ne: this._id } };
      paths.forEach((field) => {
        const value = this.get(field, undefined, { getters: false });
        if (value === undefined) return;
        query[field] = value;
      });
      return (await this.constructor.countDocuments(query)) === 0;
    },
    message: ({ value }) =>
      message || `Ya existe un documento con identificador: ${value}`,
  };
}

/**
 * Elimina el campo si es vacio. Esto deberia aplicarse solo para los campos
 * opcionales.
 */
export function removeEmpty(val: string | number) {
  if (val === null) {
    return undefined;
  }
  const tipoDato = typeof val;
  if (tipoDato === 'number') {
    return val;
  } else {
    return !val || (<string>val).length === 0 ? undefined : val;
  }
}

/**
 * Hashea las contraseña del usuario para evitar que sea de
 * fácil reconocimiento.
 */
export function hashear(text: string) {
  return crypto
    .createHash('md5')
    .update('n0T1' + text + 'Ap1')
    .digest('hex');
}

/**
 * Verifica si el el business no llega debe obligatorios estos cambios
 */
export function existeID(message: string) {
  return {
    validator() {
      const docObject = this.toObject();
      if (docObject._id) {
        return (
          !!docObject.id || (!!docObject.fechaInicio && !!docObject.fechaFin)
        );
      }
    },
    message: () => message || `Revise los campos`,
  };
}

export function esAdmin(payload: Record<string, any>, master: boolean = false) {
  if (master && !payload.master) {
    throw new BadRequestException({
      info: { typeCode: 'NoGeneralAdmin' },
      message:
        'El recurso al que intenta acceder, no esta disponible para su rol',
    });
  }
  if (!payload.admin) {
    throw new BadRequestException({
      info: { typeCode: 'NoAdministrator' },
      message:
        'El recurso al que intenta acceder, no esta disponible para su rol',
    });
  }
}

export function getPathId(cliente: ICLient): string {
  let path = cliente.id;
  if (cliente.args) {
    const args = cliente.args;
    delete args.page;
    delete args.limit;
    delete args.latest;
    for (const property in args) {
      path = `${path}/${args[property]}`;
    }
  }
  return path;
}
