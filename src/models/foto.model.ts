import {belongsTo, Entity, model, property} from '@loopback/repository';
import {Grupo, GrupoWithRelations} from './grupo.model';

@model()
export class Foto extends Entity {
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
  urlFoto: string;

  @property({
    type: 'string',
  })
  descripcion?: string;

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

  @belongsTo(() => Grupo)
  grupoId: string;

  constructor(data?: Partial<Foto>) {
    super(data);
  }
}

export interface FotoRelations {
  // describe navigational properties here
  grupo?: GrupoWithRelations;
}

export type FotosWithRelations = Foto & FotoRelations;