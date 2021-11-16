import {authenticate, AuthenticationBindings} from '@loopback/authentication';
import {Getter, inject} from '@loopback/context';
import {
  Count,
  CountSchema,
  Filter,
  repository,
  Where,
} from '@loopback/repository';
import {
  del,
  get,
  getModelSchemaRef,
  getWhereSchemaFor,
  param,
  patch,
  post,
  requestBody,
} from '@loopback/rest';
import {
  AuthUser,
  JWTService,
  MyAuthBindings,
  PermissionKey,
} from '../authorization';
import {Foto, Grupo} from '../models';
import {GrupoRepository} from '../repositories';

export class GrupoFotoController {
  constructor(
    @repository(GrupoRepository) protected grupoRepository: GrupoRepository,
    @inject(MyAuthBindings.TOKEN_SERVICE)
    public jwtService: JWTService,
    @inject.getter(AuthenticationBindings.CURRENT_USER)
    public getCurrentUser: Getter<AuthUser>,
  ) {}

  @get('/grupos/{id}/fotos', {
    responses: {
      '200': {
        description: 'Array of Grupo has many Foto',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Foto)},
          },
        },
      },
    },
  })
  @authenticate({
    strategy: 'jwt',
    options: {
      required: [PermissionKey.ViewInFoto],
    },
  })
  async find(
    @param.path.string('id') id: string,
    @param.query.object('filter') filter?: Filter<Foto>,
  ): Promise<Foto[]> {
    return this.grupoRepository.fotos(id).find(filter);
  }

  @post('/grupos/{id}/fotos', {
    responses: {
      '200': {
        description: 'Grupo model instance',
        content: {'application/json': {schema: getModelSchemaRef(Foto)}},
      },
    },
  })
  @authenticate({
    strategy: 'jwt',
    options: {
      required: [PermissionKey.CreateInFoto],
    },
  })
  async create(
    @param.path.string('id') id: typeof Grupo.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Foto, {
            title: 'NewFotoInGrupo',
            exclude: ['id'],
            optional: ['grupoId'],
          }),
        },
      },
    })
    foto: Omit<Foto, 'id'>,
  ): Promise<Foto> {
    return this.grupoRepository.fotos(id).create(foto);
  }

  @patch('/grupos/{id}/fotos', {
    responses: {
      '200': {
        description: 'Grupo.Foto PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  @authenticate({
    strategy: 'jwt',
    options: {
      required: [PermissionKey.UpdateInFoto],
    },
  })
  async patch(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Foto, {partial: true}),
        },
      },
    })
    foto: Partial<Foto>,
    @param.query.object('where', getWhereSchemaFor(Foto)) where?: Where<Foto>,
  ): Promise<Count> {
    return this.grupoRepository.fotos(id).patch(foto, where);
  }

  @del('/grupos/{id}/fotos', {
    responses: {
      '200': {
        description: 'Grupo.Foto DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  @authenticate({
    strategy: 'jwt',
    options: {
      required: [PermissionKey.DeleteInFoto],
    },
  })
  async delete(
    @param.path.string('id') id: string,
    @param.query.object('where', getWhereSchemaFor(Foto)) where?: Where<Foto>,
  ): Promise<Count> {
    return this.grupoRepository.fotos(id).delete(where);
  }
}
