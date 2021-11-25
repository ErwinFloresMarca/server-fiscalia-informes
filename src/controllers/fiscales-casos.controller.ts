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
import {Casos, Fiscales} from '../models';
import {FiscalesRepository} from '../repositories';

export class FiscalesCasosController {
  constructor(
    @repository(FiscalesRepository)
    protected fiscalesRepository: FiscalesRepository,
    @inject(MyAuthBindings.TOKEN_SERVICE)
    public jwtService: JWTService,
    @inject.getter(AuthenticationBindings.CURRENT_USER)
    public getCurrentUser: Getter<AuthUser>,
  ) {}

  @get('/fiscales/{id}/casos', {
    responses: {
      '200': {
        description: 'Array of Fiscales has many Casos',
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
  async find(
    @param.path.string('id') id: string,
    @param.query.object('filter') filter?: Filter<Casos>,
  ): Promise<Casos[]> {
    return this.fiscalesRepository.casos(id).find(filter);
  }

  @post('/fiscales/{id}/casos', {
    responses: {
      '200': {
        description: 'Fiscales model instance',
        content: {'application/json': {schema: getModelSchemaRef(Casos)}},
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
    @param.path.string('id') id: typeof Fiscales.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Casos, {
            title: 'NewCasosInFiscales',
            exclude: ['id'],
            optional: ['fiscalId'],
          }),
        },
      },
    })
    casos: Omit<Casos, 'id'>,
  ): Promise<Casos> {
    return this.fiscalesRepository.casos(id).create(casos);
  }

  @patch('/fiscales/{id}/casos', {
    responses: {
      '200': {
        description: 'Fiscales.Casos PATCH success count',
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
          schema: getModelSchemaRef(Casos, {partial: true}),
        },
      },
    })
    casos: Partial<Casos>,
    @param.query.object('where', getWhereSchemaFor(Casos)) where?: Where<Casos>,
  ): Promise<Count> {
    return this.fiscalesRepository.casos(id).patch(casos, where);
  }

  @del('/fiscales/{id}/casos', {
    responses: {
      '200': {
        description: 'Fiscales.Casos DELETE success count',
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
    @param.query.object('where', getWhereSchemaFor(Casos)) where?: Where<Casos>,
  ): Promise<Count> {
    return this.fiscalesRepository.casos(id).delete(where);
  }
}
