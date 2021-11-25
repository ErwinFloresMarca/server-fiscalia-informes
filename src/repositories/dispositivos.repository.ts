import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, HasManyRepositoryFactory, BelongsToAccessor} from '@loopback/repository';
import {DbDataSource} from '../datasources';
import {Dispositivos, DispositivosRelations, InformeFotografico, Propietarios, TipoDispositivos} from '../models';
import {InformeFotograficoRepository} from './informe-fotografico.repository';
import {PropietariosRepository} from './propietarios.repository';
import {TipoDispositivosRepository} from './tipo-dispositivos.repository';

export class DispositivosRepository extends DefaultCrudRepository<
  Dispositivos,
  typeof Dispositivos.prototype.id,
  DispositivosRelations
> {

  public readonly informeFotograficos: HasManyRepositoryFactory<InformeFotografico, typeof Dispositivos.prototype.id>;

  public readonly propietario: BelongsToAccessor<Propietarios, typeof Dispositivos.prototype.id>;

  public readonly tipoDispositivo: BelongsToAccessor<TipoDispositivos, typeof Dispositivos.prototype.id>;

  constructor(
    @inject('datasources.db') dataSource: DbDataSource, @repository.getter('InformeFotograficoRepository') protected informeFotograficoRepositoryGetter: Getter<InformeFotograficoRepository>, @repository.getter('PropietariosRepository') protected propietariosRepositoryGetter: Getter<PropietariosRepository>, @repository.getter('TipoDispositivosRepository') protected tipoDispositivosRepositoryGetter: Getter<TipoDispositivosRepository>,
  ) {
    super(Dispositivos, dataSource);
    this.tipoDispositivo = this.createBelongsToAccessorFor('tipoDispositivo', tipoDispositivosRepositoryGetter,);
    this.registerInclusionResolver('tipoDispositivo', this.tipoDispositivo.inclusionResolver);
    this.propietario = this.createBelongsToAccessorFor('propietario', propietariosRepositoryGetter,);
    this.registerInclusionResolver('propietario', this.propietario.inclusionResolver);
    this.informeFotograficos = this.createHasManyRepositoryFactoryFor('informeFotograficos', informeFotograficoRepositoryGetter,);
    this.registerInclusionResolver('informeFotograficos', this.informeFotograficos.inclusionResolver);
  }
}
