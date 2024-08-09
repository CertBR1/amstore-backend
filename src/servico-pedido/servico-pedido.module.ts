import { Module } from '@nestjs/common';
import { ServicoPedidoService } from './servico-pedido.service';
import { ServicoPedidoController } from './servico-pedido.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServicoPedido } from './entities/servico-pedido.entity';
import { Pedido } from 'src/pedido/entities/pedido.entity';
import { Transacao } from 'src/transacao/entities/transacao.entity';
import { Servico } from 'src/servico/entities/servico.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ServicoPedido,
      Pedido,
      Transacao,
      Servico
    ]),
  ],
  controllers: [ServicoPedidoController],
  providers: [ServicoPedidoService],
  exports: [ServicoPedidoService]
})
export class ServicoPedidoModule { }
