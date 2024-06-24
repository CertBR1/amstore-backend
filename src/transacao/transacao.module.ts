import { Module } from '@nestjs/common';
import { TransacaoService } from './transacao.service';
import { TransacaoController } from './transacao.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Transacao } from './entities/transacao.entity';
import { Pedido } from 'src/pedido/entities/pedido.entity';
import { FormaPagamento } from 'src/pedido/entities/forma-pagamento';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Transacao,
      Pedido,
      FormaPagamento
    ]),
  ],
  controllers: [TransacaoController],
  providers: [TransacaoService],
})
export class TransacaoModule { }
