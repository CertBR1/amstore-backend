import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ServicoModule } from './servico/servico.module';
import { FornecedorModule } from './fornecedor/fornecedor.module';
import { ClienteModule } from './cliente/cliente.module';
import { TransacaoModule } from './transacao/transacao.module';
import { SeguimentoModule } from './seguimento/seguimento.module';
import { SubcategoriaModule } from './subcategoria/subcategoria.module';
import { CategoriaModule } from './categoria/categoria.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PedidoModule } from './pedido/pedido.module';
import { ServicoSeguimentadoModule } from './servico-seguimentado/servico-seguimentado.module';
import { ServicoPedidoModule } from './servico-pedido/servico-pedido.module';
import { AdminModule } from './admin/admin.module';
import { ConfigSistemaModule } from './config-sistema/config-sistema.module';
import { HttpModule } from '@nestjs/axios';
import { AuthModule } from './auth/auth.module';
import { EmailModule } from './email/email.module';
import { AxiosClientModule } from './axios-client/axios-client.module';
import { MercadoPagoModule } from './mercado-pago/mercado-pago.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DATABASE_HOST,
      port: 5433,
      username: process.env.DATABASE_USER,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME,
      autoLoadEntities: true,
      synchronize: true,
    }),
    ServicoModule,
    FornecedorModule,
    ClienteModule,
    TransacaoModule,
    CategoriaModule,
    SubcategoriaModule,
    SeguimentoModule,
    PedidoModule,
    ServicoSeguimentadoModule,
    ServicoPedidoModule,
    AdminModule,
    ConfigSistemaModule,
    AuthModule,
    EmailModule,
    AxiosClientModule,
    MercadoPagoModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
