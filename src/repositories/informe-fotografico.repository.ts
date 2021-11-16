import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, BelongsToAccessor, HasManyRepositoryFactory} from '@loopback/repository';
import {DbDataSource} from '../datasources';
import {InformeFotografico, InformeFotograficoRelations, User, Grupo} from '../models';
import {UserRepository} from './user.repository';
import {GrupoRepository} from './grupo.repository';

export class InformeFotograficoRepository extends DefaultCrudRepository<
  InformeFotografico,
  typeof InformeFotografico.prototype.id,
  InformeFotograficoRelations
> {

  public readonly user: BelongsToAccessor<User, typeof InformeFotografico.prototype.id>;

  public readonly grupos: HasManyRepositoryFactory<Grupo, typeof InformeFotografico.prototype.id>;

  constructor(
    @inject('datasources.db') dataSource: DbDataSource, @repository.getter('UserRepository') protected userRepositoryGetter: Getter<UserRepository>, @repository.getter('GrupoRepository') protected grupoRepositoryGetter: Getter<GrupoRepository>,
  ) {
    super(InformeFotografico, dataSource);
    this.grupos = this.createHasManyRepositoryFactoryFor('grupos', grupoRepositoryGetter,);
    this.registerInclusionResolver('grupos', this.grupos.inclusionResolver);
    this.user = this.createBelongsToAccessorFor('user', userRepositoryGetter,);
    this.registerInclusionResolver('user', this.user.inclusionResolver);
  }
}
