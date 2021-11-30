import {
  belongsTo,
  Entity,
  hasMany,
  model,
  property,
} from '@loopback/repository';
import {InformeFotograficoWithRelations} from '.';
import {Fiscales, FiscalesWithRelations} from './fiscales.model';
import {InformeFotografico} from './informe-fotografico.model';

@model()
export class Casos extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  id?: string;

  @property({
    type: 'string',
    required: true,
    index: {
      unique: true,
    },
  })
  cud: string;

  @property({
    type: 'string',
    required: true,
  })
  delito: string;

  @property({
    type: 'date',
    defaultFn: 'now',
  })
  created?: Date;

  @hasMany(() => InformeFotografico, {keyTo: 'casoId'})
  informeFotograficos: InformeFotografico[];

  @belongsTo(() => Fiscales)
  fiscalId: string;

  constructor(data?: Partial<Casos>) {
    super(data);
  }
}

export interface CasosRelations {
  // describe navigational properties here
  informeFotograficos?: InformeFotograficoWithRelations;
  fiscal?: FiscalesWithRelations;
}

export type CasosWithRelations = Casos & CasosRelations;
