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
import {Dispositivos, TipoDispositivos} from '../models';
import {TipoDispositivosRepository} from '../repositories';

export class TipoDispositivosDispositivosController {
  constructor(
    @repository(TipoDispositivosRepository)
    protected tipoDispositivosRepository: TipoDispositivosRepository,
    @inject(MyAuthBindings.TOKEN_SERVICE)
    public jwtService: JWTService,
    @inject.getter(AuthenticationBindings.CURRENT_USER)
    public getCurrentUser: Getter<AuthUser>,
  ) {}

  @get('/tipo-dispositivos/{id}/dispositivos', {
    responses: {
      '200': {
        description: 'Array of TipoDispositivos has many Dispositivos',
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
  async find(
    @param.path.string('id') id: string,
    @param.query.object('filter') filter?: Filter<Dispositivos>,
  ): Promise<Dispositivos[]> {
    return this.tipoDispositivosRepository.dispositivos(id).find(filter);
  }

  @post('/tipo-dispositivos/{id}/dispositivos', {
    responses: {
      '200': {
        description: 'TipoDispositivos model instance',
        content: {
          'application/json': {schema: getModelSchemaRef(Dispositivos)},
        },
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
    @param.path.string('id') id: typeof TipoDispositivos.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Dispositivos, {
            title: 'NewDispositivosInTipoDispositivos',
            exclude: ['id'],
            optional: ['tipoDispositivoId'],
          }),
        },
      },
    })
    dispositivos: Omit<Dispositivos, 'id'>,
  ): Promise<Dispositivos> {
    return this.tipoDispositivosRepository
      .dispositivos(id)
      .create(dispositivos);
  }

  @patch('/tipo-dispositivos/{id}/dispositivos', {
    responses: {
      '200': {
        description: 'TipoDispositivos.Dispositivos PATCH success count',
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
          schema: getModelSchemaRef(Dispositivos, {partial: true}),
        },
      },
    })
    dispositivos: Partial<Dispositivos>,
    @param.query.object('where', getWhereSchemaFor(Dispositivos))
    where?: Where<Dispositivos>,
  ): Promise<Count> {
    return this.tipoDispositivosRepository
      .dispositivos(id)
      .patch(dispositivos, where);
  }

  @del('/tipo-dispositivos/{id}/dispositivos', {
    responses: {
      '200': {
        description: 'TipoDispositivos.Dispositivos DELETE success count',
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
    @param.query.object('where', getWhereSchemaFor(Dispositivos))
    where?: Where<Dispositivos>,
  ): Promise<Count> {
    return this.tipoDispositivosRepository.dispositivos(id).delete(where);
  }
}
