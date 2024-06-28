import { Module } from '@nestjs/common';
import { PedidoService } from './pedido.service';
import { PedidoController } from './pedido.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Pedido } from './entities/pedido.entity';
import { ConfigFormaPagamento } from './entities/config-forma-pagamento.entity';
import { FormaPagamento } from './entities/forma-pagamento';
import { Transacao } from 'src/transacao/entities/transacao.entity';
import { Servico } from 'src/servico/entities/servico.entity';
import { ServicoPedido } from 'src/servico-pedido/entities/servico-pedido.entity';
import { AxiosClientService } from 'src/axios-client/axios-client.service';
import { AxiosClientModule } from 'src/axios-client/axios-client.module';
import { MercadoPagoModule } from 'src/mercado-pago/mercado-pago.module';
import { Cliente } from 'src/cliente/entities/cliente.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      FormaPagamento,
      ConfigFormaPagamento,
      Pedido,
      Servico,
      ServicoPedido,
      Transacao,
      FormaPagamento,
      Cliente
    ]),
    AxiosClientModule,
    MercadoPagoModule
  ],
  controllers: [PedidoController],
  providers: [PedidoService],
})
export class PedidoModule { }
