import {
  belongsTo,
  Entity,
  hasMany,
  model,
  property,
} from '@loopback/repository';
import {DispositivosWithRelations, GrupoWithRelations} from '.';
import {Casos, CasosWithRelations} from './casos.model';
import {Dispositivos} from './dispositivos.model';
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

  @property({
    type: 'date',
    defaultFn: 'now',
  })
  created?: Date;

  @belongsTo(() => User)
  userId: string;

  @hasMany(() => Grupo)
  grupos: Grupo[];

  @belongsTo(() => Casos)
  casoId: string;

  @belongsTo(() => Dispositivos)
  dispositivoId: string;

  constructor(data?: Partial<InformeFotografico>) {
    super(data);
  }
}

export interface InformeFotograficoRelations {
  // describe navigational properties here
  user?: UserWithRelations;
  grupos?: GrupoWithRelations[];
  caso?: CasosWithRelations[];
  dispositivo?: DispositivosWithRelations;
}

export type InformeFotograficoWithRelations = InformeFotografico &
  InformeFotograficoRelations;
