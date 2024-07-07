import { Controller, Get, Post, Req } from '@nestjs/common';
import { AxiosClientService } from './axios-client.service';
import { CacheManagerService } from 'src/cache-manager/cache-manager.service';
import { MercadoPagoService } from 'src/mercado-pago/mercado-pago.service';
import { WhastappClientService } from 'src/whastapp-client/whastapp-client.service';

@Controller('axios-client')
export class AxiosClientController {
  constructor(
    private readonly axiosClientService: AxiosClientService,
    private readonly cacheManagerService: CacheManagerService,
  ) { }
  @Post('teste')
  async testFunc(@Req() req: any) {
    if (await this.cacheManagerService.get('code') == null) {
      console.log('codigoSetado');
      await this.cacheManagerService.set('code', '123456')
    }
    console.log('cache', await this.cacheManagerService.get('code'));
    console.log(req.body.code);
    if (req.body.code == await this.cacheManagerService.get('code')) {
      return true
    } else {
      return false
    }
  }
}

