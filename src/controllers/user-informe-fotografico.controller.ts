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
import {InformeFotografico, User} from '../models';
import {UserRepository} from '../repositories';

export class UserInformeFotograficoController {
  constructor(
    @repository(UserRepository) protected userRepository: UserRepository,
    @inject(MyAuthBindings.TOKEN_SERVICE)
    public jwtService: JWTService,
    @inject.getter(AuthenticationBindings.CURRENT_USER)
    public getCurrentUser: Getter<AuthUser>,
  ) {}

  @get('/users/{id}/informe-fotograficos', {
    responses: {
      '200': {
        description: 'Array of User has many InformeFotografico',
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
    return this.userRepository.informeFotograficos(id).find(filter);
  }

  @post('/users/{id}/informe-fotograficos', {
    responses: {
      '200': {
        description: 'User model instance',
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
    @param.path.string('id') id: typeof User.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(InformeFotografico, {
            title: 'NewInformeFotograficoInUser',
            exclude: ['id'],
            optional: ['userId'],
          }),
        },
      },
    })
    informeFotografico: Omit<InformeFotografico, 'id'>,
  ): Promise<InformeFotografico> {
    return this.userRepository
      .informeFotograficos(id)
      .create(informeFotografico);
  }

  @patch('/users/{id}/informe-fotograficos', {
    responses: {
      '200': {
        description: 'User.InformeFotografico PATCH success count',
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
    return this.userRepository
      .informeFotograficos(id)
      .patch(informeFotografico, where);
  }

  @del('/users/{id}/informe-fotograficos', {
    responses: {
      '200': {
        description: 'User.InformeFotografico DELETE success count',
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
    return this.userRepository.informeFotograficos(id).delete(where);
  }
}
