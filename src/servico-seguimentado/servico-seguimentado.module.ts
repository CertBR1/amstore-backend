import { Module } from '@nestjs/common';
import { ServicoSeguimentadoService } from './servico-seguimentado.service';
import { ServicoSeguimentadoController } from './servico-seguimentado.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServicoSeguimentado } from './entities/servico-seguimentado.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ServicoSeguimentado
    ]),
  ],
  controllers: [ServicoSeguimentadoController],
  providers: [ServicoSeguimentadoService],
})
export class ServicoSeguimentadoModule { }
