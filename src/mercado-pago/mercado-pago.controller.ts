import { Controller, Get } from '@nestjs/common';
import { MercadoPagoService } from './mercado-pago.service';

@Controller('mercado-pago')
export class MercadoPagoController {
  constructor(private readonly mercadoPagoService: MercadoPagoService) {
  }
  @Get('teste')
  async create() {
    const client = this.mercadoPagoService.createClient('TEST-2822216608103293-013019-a383e63a5d08cf73609023acf458723e-232977222');
    // const pagamento = await this.mercadoPagoService.criarPagamento(client, {
    //   transaction_amount: 100,
    //   description: 'teste',
    //   payment_method_id: 'pix',
    //   payer: {
    //     email: '5L9XU@example.com'
    //   }
    // })
    // console.log(pagamento.id);
    const pagamento2 = await this.mercadoPagoService.obterPagamento(client, 1318703310);
    return pagamento2

  }
}
