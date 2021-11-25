import {Entity, hasMany, model, property} from '@loopback/repository';
import {Dispositivos, DispositivosWithRelations} from './dispositivos.model';

@model()
export class TipoDispositivos extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  id?: string;

  @property({
    type: 'string',
    required: true,
  })
  tipo: string;

  @property({
    type: 'object',
    required: true,
  })
  atributos: object;

  @property({
    type: 'date',
    defaultFn: 'now',
  })
  created?: Date;

  @hasMany(() => Dispositivos, {keyTo: 'tipoDispositivoId'})
  dispositivos: Dispositivos[];

  constructor(data?: Partial<TipoDispositivos>) {
    super(data);
  }
}

export interface TipoDispositivosRelations {
  // describe navigational properties here
  dispositivos: DispositivosWithRelations[];
}

export type TipoDispositivosWithRelations = TipoDispositivos &
  TipoDispositivosRelations;
