import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, HasManyRepositoryFactory} from '@loopback/repository';
import {DbDataSource} from '../datasources';
import {TipoDispositivos, TipoDispositivosRelations, Dispositivos} from '../models';
import {DispositivosRepository} from './dispositivos.repository';

export class TipoDispositivosRepository extends DefaultCrudRepository<
  TipoDispositivos,
  typeof TipoDispositivos.prototype.id,
  TipoDispositivosRelations
> {

  public readonly dispositivos: HasManyRepositoryFactory<Dispositivos, typeof TipoDispositivos.prototype.id>;

  constructor(
    @inject('datasources.db') dataSource: DbDataSource, @repository.getter('DispositivosRepository') protected dispositivosRepositoryGetter: Getter<DispositivosRepository>,
  ) {
    super(TipoDispositivos, dataSource);
    this.dispositivos = this.createHasManyRepositoryFactoryFor('dispositivos', dispositivosRepositoryGetter,);
    this.registerInclusionResolver('dispositivos', this.dispositivos.inclusionResolver);
  }
}
