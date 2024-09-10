import { Module } from '@nestjs/common';
import { ClienteService } from './cliente.service';
import { ClienteController } from './cliente.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cliente } from './entities/cliente.entity';
import { ServicoPedidoModule } from 'src/servico-pedido/servico-pedido.module';
import { PedidoModule } from 'src/pedido/pedido.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Cliente
    ]),
    ServicoPedidoModule,
    PedidoModule
  ],
  controllers: [ClienteController],
  providers: [ClienteService],
})
export class ClienteModule { }
