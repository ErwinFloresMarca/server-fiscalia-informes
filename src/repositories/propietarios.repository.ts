import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, HasManyRepositoryFactory} from '@loopback/repository';
import {DbDataSource} from '../datasources';
import {Propietarios, PropietariosRelations, Dispositivos} from '../models';
import {DispositivosRepository} from './dispositivos.repository';

export class PropietariosRepository extends DefaultCrudRepository<
  Propietarios,
  typeof Propietarios.prototype.nombres,
  PropietariosRelations
> {

  public readonly dispositivos: HasManyRepositoryFactory<Dispositivos, typeof Propietarios.prototype.nombres>;

  constructor(
    @inject('datasources.db') dataSource: DbDataSource, @repository.getter('DispositivosRepository') protected dispositivosRepositoryGetter: Getter<DispositivosRepository>,
  ) {
    super(Propietarios, dataSource);
    this.dispositivos = this.createHasManyRepositoryFactoryFor('dispositivos', dispositivosRepositoryGetter,);
    this.registerInclusionResolver('dispositivos', this.dispositivos.inclusionResolver);
  }
}
