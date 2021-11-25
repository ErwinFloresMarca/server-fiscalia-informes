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
import {Fiscales} from '../models';
import {FiscalesRepository} from '../repositories';

export class FiscalController {
  constructor(
    @repository(FiscalesRepository)
    public fiscalesRepository: FiscalesRepository,
    @inject(MyAuthBindings.TOKEN_SERVICE)
    public jwtService: JWTService,
    @inject.getter(AuthenticationBindings.CURRENT_USER)
    public getCurrentUser: Getter<AuthUser>,
  ) {}

  @post('/fiscales')
  @response(200, {
    description: 'Fiscales model instance',
    content: {'application/json': {schema: getModelSchemaRef(Fiscales)}},
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
          schema: getModelSchemaRef(Fiscales, {
            title: 'NewFiscales',
            exclude: ['id'],
          }),
        },
      },
    })
    fiscales: Omit<Fiscales, 'id'>,
  ): Promise<Fiscales> {
    return this.fiscalesRepository.create(fiscales);
  }

  @get('/fiscales/count')
  @response(200, {
    description: 'Fiscales model count',
    content: {'application/json': {schema: CountSchema}},
  })
  @authenticate({
    strategy: 'jwt',
    options: {
      required: [PermissionKey.ViewInFoto],
    },
  })
  async count(@param.where(Fiscales) where?: Where<Fiscales>): Promise<Count> {
    return this.fiscalesRepository.count(where);
  }

  @get('/fiscales')
  @response(200, {
    description: 'Array of Fiscales model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Fiscales, {includeRelations: true}),
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
    @param.filter(Fiscales) filter?: Filter<Fiscales>,
  ): Promise<Fiscales[]> {
    return this.fiscalesRepository.find(filter);
  }

  @patch('/fiscales')
  @response(200, {
    description: 'Fiscales PATCH success count',
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
          schema: getModelSchemaRef(Fiscales, {partial: true}),
        },
      },
    })
    fiscales: Fiscales,
    @param.where(Fiscales) where?: Where<Fiscales>,
  ): Promise<Count> {
    return this.fiscalesRepository.updateAll(fiscales, where);
  }

  @get('/fiscales/{id}')
  @response(200, {
    description: 'Fiscales model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Fiscales, {includeRelations: true}),
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
    @param.filter(Fiscales, {exclude: 'where'})
    filter?: FilterExcludingWhere<Fiscales>,
  ): Promise<Fiscales> {
    return this.fiscalesRepository.findById(id, filter);
  }

  @patch('/fiscales/{id}')
  @response(204, {
    description: 'Fiscales PATCH success',
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
          schema: getModelSchemaRef(Fiscales, {partial: true}),
        },
      },
    })
    fiscales: Fiscales,
  ): Promise<void> {
    await this.fiscalesRepository.updateById(id, fiscales);
  }

  @put('/fiscales/{id}')
  @response(204, {
    description: 'Fiscales PUT success',
  })
  @authenticate({
    strategy: 'jwt',
    options: {
      required: [PermissionKey.UpdateInFoto],
    },
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() fiscales: Fiscales,
  ): Promise<void> {
    await this.fiscalesRepository.replaceById(id, fiscales);
  }

  @del('/fiscales/{id}')
  @response(204, {
    description: 'Fiscales DELETE success',
  })
  @authenticate({
    strategy: 'jwt',
    options: {
      required: [PermissionKey.DeleteInFoto],
    },
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.fiscalesRepository.deleteById(id);
  }
}
