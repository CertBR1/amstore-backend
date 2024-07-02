import { Module } from '@nestjs/common';
import { WebhookService } from './webhook.service';
import { WebhookController } from './webhook.controller';
import { MercadoPagoModule } from 'src/mercado-pago/mercado-pago.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Pedido } from 'src/pedido/entities/pedido.entity';
import { Transacao } from 'src/transacao/entities/transacao.entity';
import { ServicoPedido } from 'src/servico-pedido/entities/servico-pedido.entity';
import { HistoricoTransacao } from 'src/transacao/entities/historico-transcao.entity';
import { Fornecedor } from 'src/fornecedor/entities/fornecedor.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Pedido,
      Transacao,
      ServicoPedido,
      HistoricoTransacao,
      Fornecedor
    ]),
    MercadoPagoModule
  ],
  controllers: [WebhookController],
  providers: [WebhookService],
})
export class WebhookModule { }
