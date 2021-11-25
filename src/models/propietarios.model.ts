import {Entity, hasMany, model, property} from '@loopback/repository';
import {TipoDispositivosWithRelations} from '.';
import {Dispositivos, DispositivosWithRelations} from './dispositivos.model';

@model()
export class Propietarios extends Entity {
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
  nombres?: string;

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
    type: 'date',
    defaultFn: 'now',
  })
  created?: Date;

  @hasMany(() => Dispositivos, {keyTo: 'propietarioId'})
  dispositivos: Dispositivos[];

  constructor(data?: Partial<Propietarios>) {
    super(data);
  }
}

export interface PropietariosRelations {
  // describe navigational properties here
  dispositivos: DispositivosWithRelations[];
  tipoDispositivo: TipoDispositivosWithRelations;
}

export type PropietariosWithRelations = Propietarios & PropietariosRelations;
