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
    type: 'string',
  })
  fotoWidth: string;

  @property({
    type: 'string',
  })
  fotoHeight: string;

  @property({
    type: 'date',
    defaultFn: 'now',
  })
  created?: Date;

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
