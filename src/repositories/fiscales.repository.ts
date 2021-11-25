import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, HasManyRepositoryFactory} from '@loopback/repository';
import {DbDataSource} from '../datasources';
import {Fiscales, FiscalesRelations, Casos} from '../models';
import {CasosRepository} from './casos.repository';

export class FiscalesRepository extends DefaultCrudRepository<
  Fiscales,
  typeof Fiscales.prototype.id,
  FiscalesRelations
> {

  public readonly casos: HasManyRepositoryFactory<Casos, typeof Fiscales.prototype.id>;

  constructor(
    @inject('datasources.db') dataSource: DbDataSource, @repository.getter('CasosRepository') protected casosRepositoryGetter: Getter<CasosRepository>,
  ) {
    super(Fiscales, dataSource);
    this.casos = this.createHasManyRepositoryFactoryFor('casos', casosRepositoryGetter,);
    this.registerInclusionResolver('casos', this.casos.inclusionResolver);
  }
}
