import { Controller, Get } from '@nestjs/common';
import { AxiosClientService } from './axios-client.service';
import { CacheManagerService } from 'src/cache-manager/cache-manager.service';
import { MercadoPagoService } from 'src/mercado-pago/mercado-pago.service';
import { WhastappClientService } from 'src/whastapp-client/whastapp-client.service';

@Controller('axios-client')
export class AxiosClientController {
  constructor(
    private readonly axiosClientService: AxiosClientService,
    private readonly cacheManagerService: CacheManagerService,
    private readonly whatsappService: WhastappClientService

  ) { }
  @Get('teste')
  async testFunc() {
    await this.cacheManagerService.set('code', '123456')
  }
}

