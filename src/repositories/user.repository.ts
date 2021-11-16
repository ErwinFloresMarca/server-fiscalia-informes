import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, HasManyRepositoryFactory} from '@loopback/repository';
import {DbDataSource} from '../datasources';
import {User, UserRelations, InformeFotografico} from '../models';
import {InformeFotograficoRepository} from './informe-fotografico.repository';

export class UserRepository extends DefaultCrudRepository<
  User,
  typeof User.prototype.id,
  UserRelations
> {

  public readonly informeFotograficos: HasManyRepositoryFactory<InformeFotografico, typeof User.prototype.id>;

  constructor(
    @inject('datasources.db') dataSource: DbDataSource, @repository.getter('InformeFotograficoRepository') protected informeFotograficoRepositoryGetter: Getter<InformeFotograficoRepository>,
  ) {
    super(User, dataSource);
    this.informeFotograficos = this.createHasManyRepositoryFactoryFor('informeFotograficos', informeFotograficoRepositoryGetter,);
    this.registerInclusionResolver('informeFotograficos', this.informeFotograficos.inclusionResolver);
  }
}
