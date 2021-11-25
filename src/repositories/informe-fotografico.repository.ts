import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, BelongsToAccessor, HasManyRepositoryFactory} from '@loopback/repository';
import {DbDataSource} from '../datasources';
import {InformeFotografico, InformeFotograficoRelations, User, Grupo, Casos, Dispositivos} from '../models';
import {UserRepository} from './user.repository';
import {GrupoRepository} from './grupo.repository';
import {CasosRepository} from './casos.repository';
import {DispositivosRepository} from './dispositivos.repository';

export class InformeFotograficoRepository extends DefaultCrudRepository<
  InformeFotografico,
  typeof InformeFotografico.prototype.id,
  InformeFotograficoRelations
> {

  public readonly user: BelongsToAccessor<User, typeof InformeFotografico.prototype.id>;

  public readonly grupos: HasManyRepositoryFactory<Grupo, typeof InformeFotografico.prototype.id>;

  public readonly caso: BelongsToAccessor<Casos, typeof InformeFotografico.prototype.id>;

  public readonly dispositivo: BelongsToAccessor<Dispositivos, typeof InformeFotografico.prototype.id>;

  constructor(
    @inject('datasources.db') dataSource: DbDataSource, @repository.getter('UserRepository') protected userRepositoryGetter: Getter<UserRepository>, @repository.getter('GrupoRepository') protected grupoRepositoryGetter: Getter<GrupoRepository>, @repository.getter('CasosRepository') protected casosRepositoryGetter: Getter<CasosRepository>, @repository.getter('DispositivosRepository') protected dispositivosRepositoryGetter: Getter<DispositivosRepository>,
  ) {
    super(InformeFotografico, dataSource);
    this.dispositivo = this.createBelongsToAccessorFor('dispositivo', dispositivosRepositoryGetter,);
    this.registerInclusionResolver('dispositivo', this.dispositivo.inclusionResolver);
    this.caso = this.createBelongsToAccessorFor('caso', casosRepositoryGetter,);
    this.registerInclusionResolver('caso', this.caso.inclusionResolver);
    this.grupos = this.createHasManyRepositoryFactoryFor('grupos', grupoRepositoryGetter,);
    this.registerInclusionResolver('grupos', this.grupos.inclusionResolver);
    this.user = this.createBelongsToAccessorFor('user', userRepositoryGetter,);
    this.registerInclusionResolver('user', this.user.inclusionResolver);
  }
}
