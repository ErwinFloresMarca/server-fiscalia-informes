import {authenticate, AuthenticationBindings} from '@loopback/authentication';
import {Getter, inject} from '@loopback/context';
import {repository} from '@loopback/repository';
import {get, getModelSchemaRef, param} from '@loopback/rest';
import {
  AuthUser,
  JWTService,
  MyAuthBindings,
  PermissionKey,
} from '../authorization';
import {Foto, Grupo} from '../models';
import {FotoRepository} from '../repositories';

export class FotoGrupoController {
  constructor(
    @repository(FotoRepository)
    public fotoRepository: FotoRepository,
    @inject(MyAuthBindings.TOKEN_SERVICE)
    public jwtService: JWTService,
    @inject.getter(AuthenticationBindings.CURRENT_USER)
    public getCurrentUser: Getter<AuthUser>,
  ) {}

  @get('/fotos/{id}/grupo', {
    responses: {
      '200': {
        description: 'Grupo belonging to Foto',
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
  async getGrupo(
    @param.path.string('id') id: typeof Foto.prototype.id,
  ): Promise<Grupo> {
    return this.fotoRepository.grupo(id);
  }
}
