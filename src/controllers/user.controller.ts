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
  HttpErrors,
  param,
  patch,
  post,
  put,
  requestBody,
  response,
} from '@loopback/rest';
// authentication
import {
  AuthCredential,
  AuthUser,
  CredentialsRequestBody,
  JWTService,
  MyAuthBindings,
  PermissionKey,
} from '../authorization';
import {User} from '../models';
import {UserRepository} from '../repositories';

export class UserController {
  constructor(
    @repository(UserRepository)
    public userRepository: UserRepository,
    @inject(MyAuthBindings.TOKEN_SERVICE)
    public jwtService: JWTService,
    @inject.getter(AuthenticationBindings.CURRENT_USER)
    public getCurrentUser: Getter<AuthUser>,
  ) {}

  @post('/users')
  @response(200, {
    description: 'User model instance',
    content: {'application/json': {schema: getModelSchemaRef(User)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(User, {
            title: 'NewUser',
            exclude: ['id'],
          }),
        },
      },
    })
    user: Omit<User, 'id'>,
  ): Promise<User> {
    if (!user.permissions) {
      user.permissions = [
        PermissionKey.CreateUser,
        PermissionKey.DeleteUser,
        PermissionKey.UpdateUser,
        PermissionKey.ViewUser,
        PermissionKey.ViewInFoto,
        PermissionKey.CreateInFoto,
        PermissionKey.UpdateInFoto,
        PermissionKey.DeleteInFoto,
      ];
    }
    return this.userRepository.create(user);
  }

  @post('/users/login')
  @response(200, {
    description: 'Token',
    content: {},
  })
  async login(
    @requestBody(CredentialsRequestBody) credential: AuthCredential,
  ): Promise<{token: string}> {
    const token = await this.jwtService.getToken(credential);
    return {token};
  }

  @get('/users/auth')
  @response(200, {
    description: 'User model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(User, {includeRelations: true}),
      },
    },
  })
  @authenticate({
    strategy: 'jwt',
    options: {
      required: [PermissionKey.ViewUser],
    },
  })
  async findUserByToken(): Promise<User> {
    const user: AuthUser = await this.getCurrentUser();
    const resUser = await this.userRepository.findById(user.id);
    delete resUser.password;
    return resUser;
  }

  @get('/users/count')
  @response(200, {
    description: 'User model count',
    content: {'application/json': {schema: CountSchema}},
  })
  @authenticate({
    strategy: 'jwt',
    options: {
      required: [PermissionKey.ViewUser],
    },
  })
  async count(@param.where(User) where?: Where<User>): Promise<Count> {
    return this.userRepository.count(where);
  }

  @get('/users')
  @response(200, {
    description: 'Array of User model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(User, {includeRelations: true}),
        },
      },
    },
  })
  @authenticate({
    strategy: 'jwt',
    options: {
      required: [PermissionKey.ViewUser],
    },
  })
  async find(@param.filter(User) filter?: Filter<User>): Promise<User[]> {
    const users = await this.userRepository.find(filter);
    return users.map(user => {
      delete user.password;
      return user;
    });
  }

  @get('/users/permissions')
  @response(200, {
    description: 'Array of Permissions',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: String,
        },
      },
    },
  })
  @authenticate({
    strategy: 'jwt',
    options: {
      required: [PermissionKey.ViewUser],
    },
  })
  async getPermissions(): Promise<PermissionKey[]> {
    const permissions = [
      PermissionKey.CreateUser,
      PermissionKey.UpdateUser,
      PermissionKey.DeleteUser,
      PermissionKey.ViewUser,
      PermissionKey.ViewInFoto,
      PermissionKey.CreateInFoto,
      PermissionKey.UpdateInFoto,
      PermissionKey.DeleteInFoto,
    ];
    return permissions;
  }

  @patch('/users')
  @response(200, {
    description: 'User PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  @authenticate({
    strategy: 'jwt',
    options: {
      required: [PermissionKey.UpdateUser],
    },
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(User, {partial: true}),
        },
      },
    })
    user: User,
    @param.where(User) where?: Where<User>,
  ): Promise<Count> {
    return this.userRepository.updateAll(user, where);
  }

  @get('/users/{id}')
  @response(200, {
    description: 'User model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(User, {includeRelations: true}),
      },
    },
  })
  @authenticate({
    strategy: 'jwt',
    options: {
      required: [PermissionKey.ViewUser],
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(User, {exclude: 'where'}) filter?: FilterExcludingWhere<User>,
  ): Promise<User> {
    return this.userRepository.findById(id, filter);
  }

  @patch('/users/my-account')
  @response(204, {
    description: 'User PATCH success',
  })
  @authenticate({
    strategy: 'jwt',
    options: {
      required: [],
    },
  })
  async updateMyUser(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(User, {partial: true}),
        },
      },
    })
    user: User,
  ): Promise<void> {
    const authUser: AuthUser = await this.getCurrentUser();
    await this.userRepository.updateById(authUser.id, user);
  }

  @patch('/users/{id}')
  @response(204, {
    description: 'User PATCH success',
  })
  @authenticate({
    strategy: 'jwt',
    options: {
      required: [PermissionKey.UpdateUser],
    },
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(User, {partial: true}),
        },
      },
    })
    user: User,
  ): Promise<void> {
    await this.userRepository.updateById(id, user);
  }

  @put('/users/{id}')
  @response(204, {
    description: 'User PUT success',
  })
  @authenticate({
    strategy: 'jwt',
    options: {
      required: [PermissionKey.UpdateUser],
    },
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() user: User,
  ): Promise<void> {
    if (!user.permissions)
      user.permissions = [
        PermissionKey.CreateUser,
        PermissionKey.DeleteUser,
        PermissionKey.UpdateUser,
        PermissionKey.ViewUser,
        PermissionKey.ViewInFoto,
        PermissionKey.CreateInFoto,
        PermissionKey.UpdateInFoto,
        PermissionKey.DeleteInFoto,
      ];
    await this.userRepository.replaceById(id, user);
  }

  @del('/users/{id}')
  @response(204, {
    description: 'User DELETE success',
  })
  @authenticate({
    strategy: 'jwt',
    options: {
      required: [PermissionKey.DeleteUser],
    },
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    const currentUser = await this.getCurrentUser();
    if (id !== currentUser.id) {
      await this.userRepository.deleteById(id);
    } else {
      throw new HttpErrors.Unauthorized();
    }
  }
}
