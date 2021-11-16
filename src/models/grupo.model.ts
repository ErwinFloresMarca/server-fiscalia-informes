import {
  belongsTo,
  Entity,
  hasMany,
  model,
  property,
} from '@loopback/repository';
import {InformeFotograficoWithRelations} from '.';
import {Foto, FotosWithRelations} from './foto.model';
import {InformeFotografico} from './informe-fotografico.model';

@model()
export class Grupo extends Entity {
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
  tituloGrupo: string;

  @property({
    type: 'array',
    itemType: 'string',
    default: [],
  })
  ordenFotos?: string[];

  @property({
    type: 'number',
    required: true,
  })
  fotoWidth: number;

  @property({
    type: 'number',
    required: true,
  })
  fotoHeight: number;

  @belongsTo(() => InformeFotografico)
  informeFotograficoId: string;

  @hasMany(() => Foto)
  fotos: Foto[];

  constructor(data?: Partial<Grupo>) {
    super(data);
  }
}

export interface GrupoRelations {
  // describe navigational properties here
  informeFotografico?: InformeFotograficoWithRelations;
  fotos?: FotosWithRelations[];
}

export type GrupoWithRelations = Grupo & GrupoRelations;
