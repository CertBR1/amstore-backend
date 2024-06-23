import { Module } from '@nestjs/common';
import { SeguimentoService } from './seguimento.service';
import { SeguimentoController } from './seguimento.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Seguimento } from './entities/seguimento.entity';
import { TipoSeguimento } from './entities/tipo-seguimento.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Seguimento,
      TipoSeguimento
    ]),
  ],
  controllers: [SeguimentoController],
  providers: [SeguimentoService],
})
export class SeguimentoModule { }
