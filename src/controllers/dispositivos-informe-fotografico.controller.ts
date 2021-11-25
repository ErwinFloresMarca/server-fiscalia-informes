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
import {Dispositivos, InformeFotografico} from '../models';
import {DispositivosRepository} from '../repositories';

export class DispositivosInformeFotograficoController {
  constructor(
    @repository(DispositivosRepository)
    protected dispositivosRepository: DispositivosRepository,
    @inject(MyAuthBindings.TOKEN_SERVICE)
    public jwtService: JWTService,
    @inject.getter(AuthenticationBindings.CURRENT_USER)
    public getCurrentUser: Getter<AuthUser>,
  ) {}

  @get('/dispositivos/{id}/informe-fotograficos', {
    responses: {
      '200': {
        description: 'Array of Dispositivos has many InformeFotografico',
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
  async find(
    @param.path.string('id') id: string,
    @param.query.object('filter') filter?: Filter<InformeFotografico>,
  ): Promise<InformeFotografico[]> {
    return this.dispositivosRepository.informeFotograficos(id).find(filter);
  }

  @post('/dispositivos/{id}/informe-fotograficos', {
    responses: {
      '200': {
        description: 'Dispositivos model instance',
        content: {
          'application/json': {schema: getModelSchemaRef(InformeFotografico)},
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
    @param.path.string('id') id: typeof Dispositivos.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(InformeFotografico, {
            title: 'NewInformeFotograficoInDispositivos',
            exclude: ['id'],
            optional: ['dispositivoId'],
          }),
        },
      },
    })
    informeFotografico: Omit<InformeFotografico, 'id'>,
  ): Promise<InformeFotografico> {
    return this.dispositivosRepository
      .informeFotograficos(id)
      .create(informeFotografico);
  }

  @patch('/dispositivos/{id}/informe-fotograficos', {
    responses: {
      '200': {
        description: 'Dispositivos.InformeFotografico PATCH success count',
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
          schema: getModelSchemaRef(InformeFotografico, {partial: true}),
        },
      },
    })
    informeFotografico: Partial<InformeFotografico>,
    @param.query.object('where', getWhereSchemaFor(InformeFotografico))
    where?: Where<InformeFotografico>,
  ): Promise<Count> {
    return this.dispositivosRepository
      .informeFotograficos(id)
      .patch(informeFotografico, where);
  }

  @del('/dispositivos/{id}/informe-fotograficos', {
    responses: {
      '200': {
        description: 'Dispositivos.InformeFotografico DELETE success count',
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
    @param.query.object('where', getWhereSchemaFor(InformeFotografico))
    where?: Where<InformeFotografico>,
  ): Promise<Count> {
    return this.dispositivosRepository.informeFotograficos(id).delete(where);
  }
}
