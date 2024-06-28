import { Controller, Get } from '@nestjs/common';
import { MercadoPagoService } from './mercado-pago.service';
import { WhastappClientService } from 'src/whastapp-client/whastapp-client.service';
import { CacheManagerService } from 'src/cache-manager/cache-manager.service';

@Controller('mercado-pago')
export class MercadoPagoController {
  constructor(
    private readonly mercadoPagoService: MercadoPagoService,
    private readonly cacheManagerService: CacheManagerService

  ) {
  }
  @Get('teste')
  async create() {
    const client = await this.mercadoPagoService.createClient('TEST-2822216608103293-013019-a383e63a5d08cf73609023acf458723e-232977222')
    return await this.mercadoPagoService.criarPagamento(client, {
      description: 'teste',
      payment_method_id: 'pix',
      notification_url: 'https://webhook.site/6ff3b1d1-3f97-4297-90ed-3db38536c40f',
      transaction_amount: 100,
      payer: {
        email: 'I0s6H@example.com'
      },
    })
  }
}
