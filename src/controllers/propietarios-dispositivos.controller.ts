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
import {Dispositivos, Propietarios} from '../models';
import {PropietariosRepository} from '../repositories';

export class PropietariosDispositivosController {
  constructor(
    @repository(PropietariosRepository)
    protected propietariosRepository: PropietariosRepository,
    @inject(MyAuthBindings.TOKEN_SERVICE)
    public jwtService: JWTService,
    @inject.getter(AuthenticationBindings.CURRENT_USER)
    public getCurrentUser: Getter<AuthUser>,
  ) {}

  @get('/propietarios/{id}/dispositivos', {
    responses: {
      '200': {
        description: 'Array of Propietarios has many Dispositivos',
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
    return this.propietariosRepository.dispositivos(id).find(filter);
  }

  @post('/propietarios/{id}/dispositivos', {
    responses: {
      '200': {
        description: 'Propietarios model instance',
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
    @param.path.string('id') id: typeof Propietarios.prototype.nombres,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Dispositivos, {
            title: 'NewDispositivosInPropietarios',
            exclude: ['id'],
            optional: ['propietarioId'],
          }),
        },
      },
    })
    dispositivos: Omit<Dispositivos, 'id'>,
  ): Promise<Dispositivos> {
    return this.propietariosRepository.dispositivos(id).create(dispositivos);
  }

  @patch('/propietarios/{id}/dispositivos', {
    responses: {
      '200': {
        description: 'Propietarios.Dispositivos PATCH success count',
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
    return this.propietariosRepository
      .dispositivos(id)
      .patch(dispositivos, where);
  }

  @del('/propietarios/{id}/dispositivos', {
    responses: {
      '200': {
        description: 'Propietarios.Dispositivos DELETE success count',
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
    return this.propietariosRepository.dispositivos(id).delete(where);
  }
}
