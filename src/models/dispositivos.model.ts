import {
  belongsTo,
  Entity,
  hasMany,
  model,
  property,
} from '@loopback/repository';
import {InformeFotograficoWithRelations} from '.';
import {InformeFotografico} from './informe-fotografico.model';
import {Propietarios, PropietariosWithRelations} from './propietarios.model';
import {TipoDispositivos} from './tipo-dispositivos.model';

@model()
export class Dispositivos extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  id?: string;

  @property({
    type: 'object',
    required: true,
  })
  info: object;

  @property({
    type: 'date',
    defaultFn: 'now',
  })
  created?: Date;

  @hasMany(() => InformeFotografico, {keyTo: 'dispositivoId'})
  informeFotograficos: InformeFotografico[];

  @belongsTo(() => Propietarios)
  propietarioId: string;

  @belongsTo(() => TipoDispositivos)
  tipoDispositivoId: string;

  constructor(data?: Partial<Dispositivos>) {
    super(data);
  }
}

export interface DispositivosRelations {
  // describe navigational properties here
  informeFotograficos?: InformeFotograficoWithRelations[];
  propietario?: PropietariosWithRelations;
}

export type DispositivosWithRelations = Dispositivos & DispositivosRelations;
