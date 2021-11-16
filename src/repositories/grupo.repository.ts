import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, BelongsToAccessor, HasManyRepositoryFactory} from '@loopback/repository';
import {DbDataSource} from '../datasources';
import {Grupo, GrupoRelations, InformeFotografico, Foto} from '../models';
import {InformeFotograficoRepository} from './informe-fotografico.repository';
import {FotoRepository} from './foto.repository';

export class GrupoRepository extends DefaultCrudRepository<
  Grupo,
  typeof Grupo.prototype.id,
  GrupoRelations
> {

  public readonly informeFotografico: BelongsToAccessor<InformeFotografico, typeof Grupo.prototype.id>;

  public readonly fotos: HasManyRepositoryFactory<Foto, typeof Grupo.prototype.id>;

  constructor(
    @inject('datasources.db') dataSource: DbDataSource, @repository.getter('InformeFotograficoRepository') protected informeFotograficoRepositoryGetter: Getter<InformeFotograficoRepository>, @repository.getter('FotoRepository') protected fotoRepositoryGetter: Getter<FotoRepository>,
  ) {
    super(Grupo, dataSource);
    this.fotos = this.createHasManyRepositoryFactoryFor('fotos', fotoRepositoryGetter,);
    this.registerInclusionResolver('fotos', this.fotos.inclusionResolver);
    this.informeFotografico = this.createBelongsToAccessorFor('informeFotografico', informeFotograficoRepositoryGetter,);
    this.registerInclusionResolver('informeFotografico', this.informeFotografico.inclusionResolver);
  }
}
