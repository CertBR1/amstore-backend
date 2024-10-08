import { Module } from '@nestjs/common';
import { ServicoService } from './servico.service';
import { ServicoController } from './servico.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Servico } from './entities/servico.entity';
import { InfoServicoAdcionais } from './entities/info-servico-adcionais';
import { InfoServicoPrincipais } from './entities/info-servico-principais';
import { Fornecedor } from 'src/fornecedor/entities/fornecedor.entity';
import { Categoria } from 'src/categoria/entities/categoria.entity';
import { Subcategoria } from 'src/subcategoria/entities/subcategoria.entity';
import { TagSeo } from './entities/tag-seo.entity';
import { ServicoSeguimentado } from 'src/servico-seguimentado/entities/servico-seguimentado.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      InfoServicoAdcionais,
      InfoServicoPrincipais,
      Servico,
      Fornecedor,
      Categoria,
      Subcategoria,
      TagSeo,
      ServicoSeguimentado
    ]),
  ],
  controllers: [ServicoController],
  providers: [ServicoService],
  exports: [ServicoService]
})
export class ServicoModule { }
