import { Module } from '@nestjs/common';
import { AxiosClientService } from './axios-client.service';
import { AxiosClientController } from './axios-client.controller';
import { HttpModule } from '@nestjs/axios';
import { CacheManagerModule } from 'src/cache-manager/cache-manager.module';
import { WhastappClientModule } from 'src/whastapp-client/whastapp-client.module';
import { MercadoPagoModule } from 'src/mercado-pago/mercado-pago.module';

@Module({
  imports: [
    HttpModule,
    CacheManagerModule,
    WhastappClientModule,
    MercadoPagoModule,
    WhastappClientModule,
  ],
  controllers: [AxiosClientController],
  providers: [AxiosClientService],
  exports: [AxiosClientService]
})
export class AxiosClientModule { }
