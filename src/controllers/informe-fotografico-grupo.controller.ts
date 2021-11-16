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
import {Grupo, InformeFotografico} from '../models';
import {InformeFotograficoRepository} from '../repositories';

export class InformeFotograficoGrupoController {
  constructor(
    @repository(InformeFotograficoRepository)
    protected informeFotograficoRepository: InformeFotograficoRepository,
    @inject(MyAuthBindings.TOKEN_SERVICE)
    public jwtService: JWTService,
    @inject.getter(AuthenticationBindings.CURRENT_USER)
    public getCurrentUser: Getter<AuthUser>,
  ) {}

  @get('/informe-fotograficos/{id}/grupos', {
    responses: {
      '200': {
        description: 'Array of InformeFotografico has many Grupo',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Grupo)},
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
    @param.query.object('filter') filter?: Filter<Grupo>,
  ): Promise<Grupo[]> {
    return this.informeFotograficoRepository.grupos(id).find(filter);
  }

  @post('/informe-fotograficos/{id}/grupos', {
    responses: {
      '200': {
        description: 'InformeFotografico model instance',
        content: {'application/json': {schema: getModelSchemaRef(Grupo)}},
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
    @param.path.string('id') id: typeof InformeFotografico.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Grupo, {
            title: 'NewGrupoInInformeFotografico',
            exclude: ['id'],
            optional: ['informeFotograficoId'],
          }),
        },
      },
    })
    grupo: Omit<Grupo, 'id'>,
  ): Promise<Grupo> {
    return this.informeFotograficoRepository.grupos(id).create(grupo);
  }

  @patch('/informe-fotograficos/{id}/grupos', {
    responses: {
      '200': {
        description: 'InformeFotografico.Grupo PATCH success count',
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
          schema: getModelSchemaRef(Grupo, {partial: true}),
        },
      },
    })
    grupo: Partial<Grupo>,
    @param.query.object('where', getWhereSchemaFor(Grupo)) where?: Where<Grupo>,
  ): Promise<Count> {
    return this.informeFotograficoRepository.grupos(id).patch(grupo, where);
  }

  @del('/informe-fotograficos/{id}/grupos', {
    responses: {
      '200': {
        description: 'InformeFotografico.Grupo DELETE success count',
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
    @param.query.object('where', getWhereSchemaFor(Grupo)) where?: Where<Grupo>,
  ): Promise<Count> {
    return this.informeFotograficoRepository.grupos(id).delete(where);
  }
}
