import { Module } from '@nestjs/common';
import { ServicoSeguimentadoService } from './servico-seguimentado.service';
import { ServicoSeguimentadoController } from './servico-seguimentado.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServicoSeguimentado } from './entities/servico-seguimentado.entity';
import { Servico } from 'src/servico/entities/servico.entity';
import { Seguimento } from 'src/seguimento/entities/seguimento.entity';
import { Fornecedor } from 'src/fornecedor/entities/fornecedor.entity';
import { TipoSeguimento } from 'src/seguimento/entities/tipo-seguimento.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ServicoSeguimentado,
      Servico,
      Seguimento,
      Fornecedor,
      TipoSeguimento
    ]),
  ],
  controllers: [ServicoSeguimentadoController],
  providers: [ServicoSeguimentadoService],
})
export class ServicoSeguimentadoModule { }
