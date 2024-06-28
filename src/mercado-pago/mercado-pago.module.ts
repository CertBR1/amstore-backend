import { Module } from '@nestjs/common';
import { MercadoPagoService } from './mercado-pago.service';
import { MercadoPagoController } from './mercado-pago.controller';
import { CacheManagerService } from 'src/cache-manager/cache-manager.service';
import { CacheManagerModule } from 'src/cache-manager/cache-manager.module';

@Module({
  exports: [MercadoPagoService],
  imports: [CacheManagerModule],
  controllers: [MercadoPagoController],
  providers: [MercadoPagoService],
})
export class MercadoPagoModule { }
