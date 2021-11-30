import {Entity, hasMany, model, property} from '@loopback/repository';
import {CasosWithRelations} from '.';
import {Casos} from './casos.model';

@model()
export class Fiscales extends Entity {
  @property({
    type: 'string',
    required: true,
  })
  nombres: string;

  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  id?: string;

  @property({
    type: 'string',
  })
  apPaterno?: string;

  @property({
    type: 'string',
  })
  apMaterno?: string;

  @property({
    type: 'string',
    required: true,
  })
  ci: string;

  @property({
    type: 'string',
    required: true,
  })
  cargo?: string;

  @property({
    type: 'date',
    defaultFn: 'now',
  })
  created?: Date;

  @hasMany(() => Casos, {keyTo: 'fiscalId'})
  casos: Casos[];

  constructor(data?: Partial<Fiscales>) {
    super(data);
  }
}

export interface FiscalesRelations {
  // describe navigational properties here
  casos?: CasosWithRelations[];
}

export type FiscalesWithRelations = Fiscales & FiscalesRelations;
