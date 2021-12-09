import {Entity, hasMany, model, property} from '@loopback/repository';
import {PermissionKey} from '../authorization/permission-key';
import {
  InformeFotografico,
  InformeFotograficoWithRelations,
} from './informe-fotografico.model';

@model()
export class User extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  id?: string;

  @property({
    type: 'string',
    unique: true,
  })
  name?: string;

  @property({
    type: 'string',
    index: {
      unique: true,
    },
    required: true,
  })
  ci: string;

  @property({
    type: 'string',
  })
  avatar: string;

  @property({
    type: 'boolean',
    default: true,
  })
  state?: boolean;

  @property({
    type: 'date',
    defaultFn: 'now',
  })
  created?: Date;

  @property({
    type: 'string',
    required: true,
    hidden: true,
  })
  password?: string;

  @property.array(String)
  permissions: PermissionKey[];

  @hasMany(() => InformeFotografico)
  informeFotograficos: InformeFotografico[];

  constructor(data?: Partial<User>) {
    super(data);
  }
}

export interface UserRelations {
  // describe navigational properties here
  informeFotograficos?: InformeFotograficoWithRelations[];
}

export type UserWithRelations = User & UserRelations;
