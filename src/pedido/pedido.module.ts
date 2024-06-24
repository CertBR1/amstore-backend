import { Module } from '@nestjs/common';
import { PedidoService } from './pedido.service';
import { PedidoController } from './pedido.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Pedido } from './entities/pedido.entity';
import { ConfigFormaPagamento } from './entities/config-forma-pagamento.entity';
import { FormaPagamento } from './entities/forma-pagamento';
import { Transacao } from 'src/transacao/entities/transacao.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      FormaPagamento,
      ConfigFormaPagamento,
      Pedido,
      Transacao,
      FormaPagamento
    ]),
  ],
  controllers: [PedidoController],
  providers: [PedidoService],
})
export class PedidoModule { }
