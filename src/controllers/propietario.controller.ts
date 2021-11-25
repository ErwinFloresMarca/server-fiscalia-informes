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
import {Propietarios} from '../models';
import {PropietariosRepository} from '../repositories';

export class PropietarioController {
  constructor(
    @repository(PropietariosRepository)
    public propietariosRepository: PropietariosRepository,
    @inject(MyAuthBindings.TOKEN_SERVICE)
    public jwtService: JWTService,
    @inject.getter(AuthenticationBindings.CURRENT_USER)
    public getCurrentUser: Getter<AuthUser>,
  ) {}

  @post('/propietarios')
  @response(200, {
    description: 'Propietarios model instance',
    content: {'application/json': {schema: getModelSchemaRef(Propietarios)}},
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
          schema: getModelSchemaRef(Propietarios, {
            title: 'NewPropietarios',
            exclude: ['id'],
          }),
        },
      },
    })
    propietarios: Omit<Propietarios, 'id'>,
  ): Promise<Propietarios> {
    return this.propietariosRepository.create(propietarios);
  }

  @get('/propietarios/count')
  @response(200, {
    description: 'Propietarios model count',
    content: {'application/json': {schema: CountSchema}},
  })
  @authenticate({
    strategy: 'jwt',
    options: {
      required: [PermissionKey.ViewInFoto],
    },
  })
  async count(
    @param.where(Propietarios) where?: Where<Propietarios>,
  ): Promise<Count> {
    return this.propietariosRepository.count(where);
  }

  @get('/propietarios')
  @response(200, {
    description: 'Array of Propietarios model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Propietarios, {includeRelations: true}),
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
    @param.filter(Propietarios) filter?: Filter<Propietarios>,
  ): Promise<Propietarios[]> {
    return this.propietariosRepository.find(filter);
  }

  @patch('/propietarios')
  @response(200, {
    description: 'Propietarios PATCH success count',
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
          schema: getModelSchemaRef(Propietarios, {partial: true}),
        },
      },
    })
    propietarios: Propietarios,
    @param.where(Propietarios) where?: Where<Propietarios>,
  ): Promise<Count> {
    return this.propietariosRepository.updateAll(propietarios, where);
  }

  @get('/propietarios/{id}')
  @response(200, {
    description: 'Propietarios model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Propietarios, {includeRelations: true}),
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
    @param.filter(Propietarios, {exclude: 'where'})
    filter?: FilterExcludingWhere<Propietarios>,
  ): Promise<Propietarios> {
    return this.propietariosRepository.findById(id, filter);
  }

  @patch('/propietarios/{id}')
  @response(204, {
    description: 'Propietarios PATCH success',
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
          schema: getModelSchemaRef(Propietarios, {partial: true}),
        },
      },
    })
    propietarios: Propietarios,
  ): Promise<void> {
    await this.propietariosRepository.updateById(id, propietarios);
  }

  @put('/propietarios/{id}')
  @response(204, {
    description: 'Propietarios PUT success',
  })
  @authenticate({
    strategy: 'jwt',
    options: {
      required: [PermissionKey.UpdateInFoto],
    },
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() propietarios: Propietarios,
  ): Promise<void> {
    await this.propietariosRepository.replaceById(id, propietarios);
  }

  @del('/propietarios/{id}')
  @response(204, {
    description: 'Propietarios DELETE success',
  })
  @authenticate({
    strategy: 'jwt',
    options: {
      required: [PermissionKey.DeleteInFoto],
    },
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.propietariosRepository.deleteById(id);
  }
}
