import {
  belongsTo,
  Entity,
  hasMany,
  model,
  property,
} from '@loopback/repository';
import {GrupoWithRelations} from '.';
import {Grupo} from './grupo.model';
import {User, UserWithRelations} from './user.model';

@model()
export class InformeFotografico extends Entity {
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
  cud: string;

  @property({
    type: 'string',
    required: true,
  })
  propietarioDispositivo: string;

  @property({
    type: 'string',
    required: true,
  })
  victima: string;

  @property({
    type: 'string',
    required: true,
  })
  denunciado: string;

  @property({
    type: 'string',
    required: true,
  })
  marcaDispositivo: string;

  @property({
    type: 'string',
    required: true,
  })
  nombreDispositivo: string;

  @property({
    type: 'string',
    required: true,
  })
  imeiDispositivo: string;

  @property({
    type: 'string',
    required: true,
  })
  snDispositivo: string;

  @property({
    type: 'array',
    itemType: 'string',
    required: true,
  })
  ordenGrupos: string[];

  @property({
    type: 'string',
    required: true,
  })
  pieDePagina: string;

  @property({
    type: 'string',
    required: true,
  })
  encabezado: string;

  @property({
    type: 'number',
    default: 9,
  })
  fotoWidth?: number;

  @property({
    type: 'number',
    default: 12,
  })
  fotoHeight?: number;

  @property({
    type: 'string',
    required: true,
  })
  urlFotoFTP: string;

  @belongsTo(() => User)
  userId: string;

  @hasMany(() => Grupo)
  grupos: Grupo[];

  constructor(data?: Partial<InformeFotografico>) {
    super(data);
  }
}

export interface InformeFotograficoRelations {
  // describe navigational properties here
  user?: UserWithRelations;
  grupos?: GrupoWithRelations[];
}

export type InformeFotograficoWithRelations = InformeFotografico &
  InformeFotograficoRelations;
