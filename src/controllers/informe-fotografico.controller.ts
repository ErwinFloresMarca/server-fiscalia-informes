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
import {Casos, Dispositivos, InformeFotografico, User} from '../models';
import {InformeFotograficoRepository} from '../repositories';

export class InformeFotograficoController {
  constructor(
    @repository(InformeFotograficoRepository)
    public informeFotograficoRepository: InformeFotograficoRepository,
    @inject(MyAuthBindings.TOKEN_SERVICE)
    public jwtService: JWTService,
    @inject.getter(AuthenticationBindings.CURRENT_USER)
    public getCurrentUser: Getter<AuthUser>,
  ) {}

  @post('/informe-fotograficos')
  @response(200, {
    description: 'InformeFotografico model instance',
    content: {
      'application/json': {schema: getModelSchemaRef(InformeFotografico)},
    },
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
          schema: getModelSchemaRef(InformeFotografico, {
            title: 'NewInformeFotografico',
            exclude: ['id'],
          }),
        },
      },
    })
    informeFotografico: Omit<InformeFotografico, 'id'>,
  ): Promise<InformeFotografico> {
    return this.informeFotograficoRepository.create(informeFotografico);
  }

  @get('/informe-fotograficos/count')
  @response(200, {
    description: 'InformeFotografico model count',
    content: {'application/json': {schema: CountSchema}},
  })
  @authenticate({
    strategy: 'jwt',
    options: {
      required: [PermissionKey.ViewInFoto],
    },
  })
  async count(
    @param.where(InformeFotografico) where?: Where<InformeFotografico>,
  ): Promise<Count> {
    return this.informeFotograficoRepository.count(where);
  }

  @get('/informe-fotograficos')
  @response(200, {
    description: 'Array of InformeFotografico model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(InformeFotografico, {
            includeRelations: true,
          }),
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
    @param.filter(InformeFotografico) filter?: Filter<InformeFotografico>,
  ): Promise<InformeFotografico[]> {
    return this.informeFotograficoRepository.find(filter);
  }

  @get('/informe-fotograficos/{id}/dispositivos', {
    responses: {
      '200': {
        description: 'Dispositivos belonging to InformeFotografico',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Dispositivos)},
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
  async getDispositivos(
    @param.path.string('id') id: typeof InformeFotografico.prototype.id,
  ): Promise<Dispositivos> {
    return this.informeFotograficoRepository.dispositivo(id);
  }

  @get('/informe-fotograficos/{id}/casos', {
    responses: {
      '200': {
        description: 'Casos belonging to InformeFotografico',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Casos)},
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
  async getCasos(
    @param.path.string('id') id: typeof InformeFotografico.prototype.id,
  ): Promise<Casos> {
    return this.informeFotograficoRepository.caso(id);
  }

  @get('/informe-fotograficos/{id}')
  @response(200, {
    description: 'InformeFotografico model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(InformeFotografico, {includeRelations: true}),
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
    @param.filter(InformeFotografico, {exclude: 'where'})
    filter?: FilterExcludingWhere<InformeFotografico>,
  ): Promise<InformeFotografico> {
    return this.informeFotograficoRepository.findById(id, filter);
  }

  @patch('/informe-fotograficos/{id}')
  @response(204, {
    description: 'InformeFotografico PATCH success',
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
          schema: getModelSchemaRef(InformeFotografico, {partial: true}),
        },
      },
    })
    informeFotografico: InformeFotografico,
  ): Promise<void> {
    await this.informeFotograficoRepository.updateById(id, informeFotografico);
  }

  @del('/informe-fotograficos/{id}')
  @response(204, {
    description: 'InformeFotografico DELETE success',
  })
  @authenticate({
    strategy: 'jwt',
    options: {
      required: [PermissionKey.DeleteInFoto],
    },
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.informeFotograficoRepository.deleteById(id);
  }

  @get('/informe-fotograficos/{id}/user', {
    responses: {
      '200': {
        description: 'User belonging to InformeFotografico',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(User)},
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
  async getUser(
    @param.path.string('id') id: typeof InformeFotografico.prototype.id,
  ): Promise<User> {
    return this.informeFotograficoRepository.user(id);
  }
}
