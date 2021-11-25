import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, HasManyRepositoryFactory, BelongsToAccessor} from '@loopback/repository';
import {DbDataSource} from '../datasources';
import {Casos, CasosRelations, InformeFotografico, Fiscales} from '../models';
import {InformeFotograficoRepository} from './informe-fotografico.repository';
import {FiscalesRepository} from './fiscales.repository';

export class CasosRepository extends DefaultCrudRepository<
  Casos,
  typeof Casos.prototype.id,
  CasosRelations
> {

  public readonly informeFotograficos: HasManyRepositoryFactory<InformeFotografico, typeof Casos.prototype.id>;

  public readonly fiscal: BelongsToAccessor<Fiscales, typeof Casos.prototype.id>;

  constructor(
    @inject('datasources.db') dataSource: DbDataSource, @repository.getter('InformeFotograficoRepository') protected informeFotograficoRepositoryGetter: Getter<InformeFotograficoRepository>, @repository.getter('FiscalesRepository') protected fiscalesRepositoryGetter: Getter<FiscalesRepository>,
  ) {
    super(Casos, dataSource);
    this.fiscal = this.createBelongsToAccessorFor('fiscal', fiscalesRepositoryGetter,);
    this.registerInclusionResolver('fiscal', this.fiscal.inclusionResolver);
    this.informeFotograficos = this.createHasManyRepositoryFactoryFor('informeFotograficos', informeFotograficoRepositoryGetter,);
    this.registerInclusionResolver('informeFotograficos', this.informeFotograficos.inclusionResolver);
  }
}
