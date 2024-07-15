import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
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
import { CacheManagerModule } from './cache-manager/cache-manager.module';
import { WebhookModule } from './webhook/webhook.module';
import { applyRawBodyOnlyTo } from '@golevelup/nestjs-webhooks';
import { AuthAdminMiddleware } from './auth/auth-admin.middleware';
import { ServicoController } from './servico/servico.controller';
import { SeguimentoController } from './seguimento/seguimento.controller';
import { ServicoSeguimentadoController } from './servico-seguimentado/servico-seguimentado.controller';
import { PedidoController } from './pedido/pedido.controller';
import { ClienteController } from './cliente/cliente.controller';
import { FornecedorController } from './fornecedor/fornecedor.controller';
import { CategoriaController } from './categoria/categoria.controller';
import { SubcategoriaController } from './subcategoria/subcategoria.controller';
import { AdminController } from './admin/admin.controller';
import { JwtModule } from '@nestjs/jwt';
import { WhastappClientModule } from './whastapp-client/whastapp-client.module';
import { ClienteAuthMiddleware } from './auth/auth-cliente.middleware';


@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DATABASE_HOST,
      port: parseInt(process.env.DATABASE_PORT),
      username: process.env.DATABASE_USER,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME,
      autoLoadEntities: true,
      synchronize: true,
    }),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1d' },
      global: true
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
    WhastappClientModule,
    CacheManagerModule,
    WebhookModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    applyRawBodyOnlyTo(consumer, {
      method: RequestMethod.ALL,
      path: '/webhook',
    });
    consumer
      .apply(AuthAdminMiddleware)
      .exclude({ path: '/(.*)', method: RequestMethod.GET, })
      .exclude({ path: '/pedido', method: RequestMethod.POST, })
      .exclude({ path: '/admin', method: RequestMethod.POST, })
      .forRoutes(
        ServicoController,
        SeguimentoController,
        ServicoSeguimentadoController,
        PedidoController,
        ClienteController,
        FornecedorController,
        CategoriaController,
        SubcategoriaController,
        AdminController
      )
    consumer
      .apply(ClienteAuthMiddleware)
      .forRoutes({ path: '/pedido', method: RequestMethod.POST, })
  }
}
