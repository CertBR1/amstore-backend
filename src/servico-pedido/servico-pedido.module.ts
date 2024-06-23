import { Module } from '@nestjs/common';
import { ServicoPedidoService } from './servico-pedido.service';
import { ServicoPedidoController } from './servico-pedido.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServicoPedido } from './entities/servico-pedido.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ServicoPedido,
    ]),
  ],
  controllers: [ServicoPedidoController],
  providers: [ServicoPedidoService],
})
export class ServicoPedidoModule { }
