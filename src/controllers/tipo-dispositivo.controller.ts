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
import {TipoDispositivos} from '../models';
import {TipoDispositivosRepository} from '../repositories';

export class TipoDispositivoController {
  constructor(
    @repository(TipoDispositivosRepository)
    public tipoDispositivosRepository: TipoDispositivosRepository,
    @inject(MyAuthBindings.TOKEN_SERVICE)
    public jwtService: JWTService,
    @inject.getter(AuthenticationBindings.CURRENT_USER)
    public getCurrentUser: Getter<AuthUser>,
  ) {}

  @post('/tipo-dispositivos')
  @response(200, {
    description: 'TipoDispositivos model instance',
    content: {
      'application/json': {schema: getModelSchemaRef(TipoDispositivos)},
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
          schema: getModelSchemaRef(TipoDispositivos, {
            title: 'NewTipoDispositivos',
            exclude: ['id'],
          }),
        },
      },
    })
    tipoDispositivos: Omit<TipoDispositivos, 'id'>,
  ): Promise<TipoDispositivos> {
    return this.tipoDispositivosRepository.create(tipoDispositivos);
  }

  @get('/tipo-dispositivos/count')
  @response(200, {
    description: 'TipoDispositivos model count',
    content: {'application/json': {schema: CountSchema}},
  })
  @authenticate({
    strategy: 'jwt',
    options: {
      required: [PermissionKey.ViewInFoto],
    },
  })
  async count(
    @param.where(TipoDispositivos) where?: Where<TipoDispositivos>,
  ): Promise<Count> {
    return this.tipoDispositivosRepository.count(where);
  }

  @get('/tipo-dispositivos')
  @response(200, {
    description: 'Array of TipoDispositivos model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(TipoDispositivos, {includeRelations: true}),
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
    @param.filter(TipoDispositivos) filter?: Filter<TipoDispositivos>,
  ): Promise<TipoDispositivos[]> {
    return this.tipoDispositivosRepository.find(filter);
  }

  @patch('/tipo-dispositivos')
  @response(200, {
    description: 'TipoDispositivos PATCH success count',
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
          schema: getModelSchemaRef(TipoDispositivos, {partial: true}),
        },
      },
    })
    tipoDispositivos: TipoDispositivos,
    @param.where(TipoDispositivos) where?: Where<TipoDispositivos>,
  ): Promise<Count> {
    return this.tipoDispositivosRepository.updateAll(tipoDispositivos, where);
  }

  @get('/tipo-dispositivos/{id}')
  @response(200, {
    description: 'TipoDispositivos model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(TipoDispositivos, {includeRelations: true}),
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
    @param.filter(TipoDispositivos, {exclude: 'where'})
    filter?: FilterExcludingWhere<TipoDispositivos>,
  ): Promise<TipoDispositivos> {
    return this.tipoDispositivosRepository.findById(id, filter);
  }

  @patch('/tipo-dispositivos/{id}')
  @response(204, {
    description: 'TipoDispositivos PATCH success',
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
          schema: getModelSchemaRef(TipoDispositivos, {partial: true}),
        },
      },
    })
    tipoDispositivos: TipoDispositivos,
  ): Promise<void> {
    await this.tipoDispositivosRepository.updateById(id, tipoDispositivos);
  }

  @put('/tipo-dispositivos/{id}')
  @response(204, {
    description: 'TipoDispositivos PUT success',
  })
  @authenticate({
    strategy: 'jwt',
    options: {
      required: [PermissionKey.UpdateInFoto],
    },
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() tipoDispositivos: TipoDispositivos,
  ): Promise<void> {
    await this.tipoDispositivosRepository.replaceById(id, tipoDispositivos);
  }

  @del('/tipo-dispositivos/{id}')
  @response(204, {
    description: 'TipoDispositivos DELETE success',
  })
  @authenticate({
    strategy: 'jwt',
    options: {
      required: [PermissionKey.DeleteInFoto],
    },
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.tipoDispositivosRepository.deleteById(id);
  }
}
