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
import {Dispositivos, Propietarios, TipoDispositivos} from '../models';
import {DispositivosRepository} from '../repositories';

export class DispositivoController {
  constructor(
    @repository(DispositivosRepository)
    public dispositivosRepository: DispositivosRepository,
    @inject(MyAuthBindings.TOKEN_SERVICE)
    public jwtService: JWTService,
    @inject.getter(AuthenticationBindings.CURRENT_USER)
    public getCurrentUser: Getter<AuthUser>,
  ) {}

  @post('/dispositivos')
  @response(200, {
    description: 'Dispositivos model instance',
    content: {'application/json': {schema: getModelSchemaRef(Dispositivos)}},
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
          schema: getModelSchemaRef(Dispositivos, {
            title: 'NewDispositivos',
            exclude: ['id'],
          }),
        },
      },
    })
    dispositivos: Omit<Dispositivos, 'id'>,
  ): Promise<Dispositivos> {
    return this.dispositivosRepository.create(dispositivos);
  }

  @get('/dispositivos/count')
  @response(200, {
    description: 'Dispositivos model count',
    content: {'application/json': {schema: CountSchema}},
  })
  @authenticate({
    strategy: 'jwt',
    options: {
      required: [PermissionKey.ViewInFoto],
    },
  })
  async count(
    @param.where(Dispositivos) where?: Where<Dispositivos>,
  ): Promise<Count> {
    return this.dispositivosRepository.count(where);
  }

  @get('/dispositivos/{id}/propietarios', {
    responses: {
      '200': {
        description: 'Propietarios belonging to Dispositivos',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Propietarios)},
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
  async getPropietarios(
    @param.path.string('id') id: typeof Dispositivos.prototype.id,
  ): Promise<Propietarios> {
    return this.dispositivosRepository.propietario(id);
  }

  @get('/dispositivos/{id}/tipo-dispositivos', {
    responses: {
      '200': {
        description: 'TipoDispositivos belonging to Dispositivos',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(TipoDispositivos)},
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
  async getTipoDispositivos(
    @param.path.string('id') id: typeof Dispositivos.prototype.id,
  ): Promise<TipoDispositivos> {
    return this.dispositivosRepository.tipoDispositivo(id);
  }

  @get('/dispositivos')
  @response(200, {
    description: 'Array of Dispositivos model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Dispositivos, {includeRelations: true}),
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
    @param.filter(Dispositivos) filter?: Filter<Dispositivos>,
  ): Promise<Dispositivos[]> {
    return this.dispositivosRepository.find(filter);
  }

  @patch('/dispositivos')
  @response(200, {
    description: 'Dispositivos PATCH success count',
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
          schema: getModelSchemaRef(Dispositivos, {partial: true}),
        },
      },
    })
    dispositivos: Dispositivos,
    @param.where(Dispositivos) where?: Where<Dispositivos>,
  ): Promise<Count> {
    return this.dispositivosRepository.updateAll(dispositivos, where);
  }

  @get('/dispositivos/{id}')
  @response(200, {
    description: 'Dispositivos model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Dispositivos, {includeRelations: true}),
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
    @param.filter(Dispositivos, {exclude: 'where'})
    filter?: FilterExcludingWhere<Dispositivos>,
  ): Promise<Dispositivos> {
    return this.dispositivosRepository.findById(id, filter);
  }

  @patch('/dispositivos/{id}')
  @response(204, {
    description: 'Dispositivos PATCH success',
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
          schema: getModelSchemaRef(Dispositivos, {partial: true}),
        },
      },
    })
    dispositivos: Dispositivos,
  ): Promise<void> {
    await this.dispositivosRepository.updateById(id, dispositivos);
  }

  @put('/dispositivos/{id}')
  @response(204, {
    description: 'Dispositivos PUT success',
  })
  @authenticate({
    strategy: 'jwt',
    options: {
      required: [PermissionKey.UpdateInFoto],
    },
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() dispositivos: Dispositivos,
  ): Promise<void> {
    await this.dispositivosRepository.replaceById(id, dispositivos);
  }

  @del('/dispositivos/{id}')
  @response(204, {
    description: 'Dispositivos DELETE success',
  })
  @authenticate({
    strategy: 'jwt',
    options: {
      required: [PermissionKey.DeleteInFoto],
    },
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.dispositivosRepository.deleteById(id);
  }
}
