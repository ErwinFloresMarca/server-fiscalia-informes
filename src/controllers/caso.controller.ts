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
  put,
  requestBody,
  response,
} from '@loopback/rest';
import {
  AuthUser,
  JWTService,
  MyAuthBindings,
  PermissionKey,
} from '../authorization';
import {Casos, Fiscales} from '../models';
import {CasosRepository} from '../repositories';

export class CasoController {
  constructor(
    @repository(CasosRepository)
    public casosRepository: CasosRepository,
    @inject(MyAuthBindings.TOKEN_SERVICE)
    public jwtService: JWTService,
    @inject.getter(AuthenticationBindings.CURRENT_USER)
    public getCurrentUser: Getter<AuthUser>,
  ) {}

  @post('/casos')
  @response(200, {
    description: 'Casos model instance',
    content: {'application/json': {schema: getModelSchemaRef(Casos)}},
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
          schema: getModelSchemaRef(Casos, {
            title: 'NewCasos',
            exclude: ['id'],
          }),
        },
      },
    })
    casos: Omit<Casos, 'id'>,
  ): Promise<Casos> {
    return this.casosRepository.create(casos);
  }

  @get('/casos/count')
  @response(200, {
    description: 'Casos model count',
    content: {'application/json': {schema: CountSchema}},
  })
  @authenticate({
    strategy: 'jwt',
    options: {
      required: [PermissionKey.ViewInFoto],
    },
  })
  async count(@param.where(Casos) where?: Where<Casos>): Promise<Count> {
    return this.casosRepository.count(where);
  }

  @get('/casos/{id}/fiscales', {
    responses: {
      '200': {
        description: 'Fiscales belonging to Casos',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Fiscales)},
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
  async getFiscales(
    @param.path.string('id') id: typeof Casos.prototype.id,
  ): Promise<Fiscales> {
    return this.casosRepository.fiscal(id);
  }

  @get('/casos')
  @response(200, {
    description: 'Array of Casos model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Casos, {includeRelations: true}),
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
  async find(@param.filter(Casos) filter?: Filter<Casos>): Promise<Casos[]> {
    return this.casosRepository.find(filter);
  }

  @patch('/casos')
  @response(200, {
    description: 'Casos PATCH success count',
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
          schema: getModelSchemaRef(Casos, {partial: true}),
        },
      },
    })
    casos: Casos,
    @param.where(Casos) where?: Where<Casos>,
  ): Promise<Count> {
    return this.casosRepository.updateAll(casos, where);
  }

  @get('/casos/{id}')
  @response(200, {
    description: 'Casos model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Casos, {includeRelations: true}),
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
    @param.filter(Casos, {exclude: 'where'})
    filter?: FilterExcludingWhere<Casos>,
  ): Promise<Casos> {
    return this.casosRepository.findById(id, filter);
  }

  @patch('/casos/{id}')
  @response(204, {
    description: 'Casos PATCH success',
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
          schema: getModelSchemaRef(Casos, {partial: true}),
        },
      },
    })
    casos: Casos,
  ): Promise<void> {
    await this.casosRepository.updateById(id, casos);
  }

  @put('/casos/{id}')
  @response(204, {
    description: 'Casos PUT success',
  })
  @authenticate({
    strategy: 'jwt',
    options: {
      required: [PermissionKey.UpdateInFoto],
    },
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() casos: Casos,
  ): Promise<void> {
    await this.casosRepository.replaceById(id, casos);
  }

  @del('/casos/{id}')
  @response(204, {
    description: 'Casos DELETE success',
  })
  @authenticate({
    strategy: 'jwt',
    options: {
      required: [PermissionKey.DeleteInFoto],
    },
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.casosRepository.deleteById(id);
  }
}
