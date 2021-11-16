import {authenticate, AuthenticationBindings} from '@loopback/authentication';
import {Getter, inject} from '@loopback/context';
import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
  Where,
} from '@loopback/repository';
import {
  del,
  get,
  getModelSchemaRef,
  param,
  patch,
  post,
  requestBody,
  response,
} from '@loopback/rest';
import {
  AuthUser,
  JWTService,
  MyAuthBindings,
  PermissionKey,
} from '../authorization';
import {Grupo, InformeFotografico} from '../models';
import {GrupoRepository} from '../repositories';

export class GrupoController {
  constructor(
    @repository(GrupoRepository)
    public grupoRepository: GrupoRepository,
    @inject(MyAuthBindings.TOKEN_SERVICE)
    public jwtService: JWTService,
    @inject.getter(AuthenticationBindings.CURRENT_USER)
    public getCurrentUser: Getter<AuthUser>,
  ) {}

  @post('/grupos')
  @response(200, {
    description: 'Grupo model instance',
    content: {'application/json': {schema: getModelSchemaRef(Grupo)}},
  })
  @authenticate({
    strategy: 'jwt',
    options: {
      required: [PermissionKey.CreateInFoto],
    },
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Grupo, {
            title: 'NewGrupo',
            exclude: ['id'],
          }),
        },
      },
    })
    grupo: Omit<Grupo, 'id'>,
  ): Promise<Grupo> {
    return this.grupoRepository.create(grupo);
  }

  @get('/grupos/count')
  @response(200, {
    description: 'Grupo model count',
    content: {'application/json': {schema: CountSchema}},
  })
  @authenticate({
    strategy: 'jwt',
    options: {
      required: [PermissionKey.ViewInFoto],
    },
  })
  async count(@param.where(Grupo) where?: Where<Grupo>): Promise<Count> {
    return this.grupoRepository.count(where);
  }

  @get('/grupos')
  @response(200, {
    description: 'Array of Grupo model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Grupo, {includeRelations: true}),
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
  async find(@param.filter(Grupo) filter?: Filter<Grupo>): Promise<Grupo[]> {
    return this.grupoRepository.find(filter);
  }

  @patch('/grupos')
  @response(200, {
    description: 'Grupo PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  @authenticate({
    strategy: 'jwt',
    options: {
      required: [PermissionKey.UpdateInFoto],
    },
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Grupo, {partial: true}),
        },
      },
    })
    grupo: Grupo,
    @param.where(Grupo) where?: Where<Grupo>,
  ): Promise<Count> {
    return this.grupoRepository.updateAll(grupo, where);
  }

  @get('/grupos/{id}')
  @response(200, {
    description: 'Grupo model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Grupo, {includeRelations: true}),
      },
    },
  })
  @authenticate({
    strategy: 'jwt',
    options: {
      required: [PermissionKey.ViewInFoto],
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(Grupo, {exclude: 'where'})
    filter?: FilterExcludingWhere<Grupo>,
  ): Promise<Grupo> {
    return this.grupoRepository.findById(id, filter);
  }

  @patch('/grupos/{id}')
  @response(204, {
    description: 'Grupo PATCH success',
  })
  @authenticate({
    strategy: 'jwt',
    options: {
      required: [PermissionKey.UpdateInFoto],
    },
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Grupo, {partial: true}),
        },
      },
    })
    grupo: Grupo,
  ): Promise<void> {
    await this.grupoRepository.updateById(id, grupo);
  }

  @del('/grupos/{id}')
  @response(204, {
    description: 'Grupo DELETE success',
  })
  @authenticate({
    strategy: 'jwt',
    options: {
      required: [PermissionKey.DeleteInFoto],
    },
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.grupoRepository.deleteById(id);
  }

  @get('/grupos/{id}/informe-fotografico', {
    responses: {
      '200': {
        description: 'InformeFotografico belonging to Grupo',
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: getModelSchemaRef(InformeFotografico),
            },
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
  async getInformeFotografico(
    @param.path.string('id') id: typeof Grupo.prototype.id,
  ): Promise<InformeFotografico> {
    return this.grupoRepository.informeFotografico(id);
  }
}
