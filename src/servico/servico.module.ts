import { Module } from '@nestjs/common';
import { ServicoService } from './servico.service';
import { ServicoController } from './servico.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Servico } from './entities/servico.entity';
import { InfoServicoAdcionais } from './entities/info-servico-adcionais';
import { InfoServicoPrincipais } from './entities/info-servico-principais';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      InfoServicoAdcionais,
      InfoServicoPrincipais,
      Servico,
    ]),
  ],
  controllers: [ServicoController],
  providers: [ServicoService],
})
export class ServicoModule { }
