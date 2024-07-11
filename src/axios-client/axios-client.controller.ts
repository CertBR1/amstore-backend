import { Controller, Get, HttpException, Post, Req } from '@nestjs/common';
import { AxiosClientService } from './axios-client.service';
import { CacheManagerService } from 'src/cache-manager/cache-manager.service';
import { MercadoPagoService } from 'src/mercado-pago/mercado-pago.service';
import { WhastappClientService } from 'src/whastapp-client/whastapp-client.service';

@Controller('axios-client')
export class AxiosClientController {
  constructor(
    private readonly mercadoPagoService: MercadoPagoService,
    private readonly axiosClient: AxiosClientService
  ) { }
  @Post('teste')
  async testFunc(@Req() req: any) {
    const cliente = await this.mercadoPagoService.createClient('TEST-2822216608103293-013019-a383e63a5d08cf73609023acf458723e-232977222')
    // const pagamento = await this.mercadoPagoService.criarPagamentoCartao(
    //   cliente,
    //   {
    //     id: '1',
    //     title: 'teste',
    //     unit_price: 100,
    //     external_reference: '123123',
    //     quantity: 1,
    //     payer: {
    //       email: 'b2FVJ@example.com'
    //     }
    //   }
    // )
    // console.log(pagamento)
    // const merchantOrder = await this.mercadoPagoService.criarMerchantOrder(cliente,
    //   {
    //     id: '23132165484',
    //     preference_id: pagamento.id,
    //     description: 'teste',
    //     external_reference: '123123',
    //     payer: {
    //       email: 'b2FVJ@example.com'
    //     },
    //     transaction_amount: 100
    //   }

    // )
    const merchantOrder = await this.mercadoPagoService.obterPagamento(
      cliente,
      1324851881,
    )
    return { merchantOrder }
  }
  @Post('teste2')
  async testFunc2(@Req() req: any) {
    try {
      return await this.axiosClient.enviarMensagem(
        'https://api-chat.agenciamarangoni.com/api/messages/send',
        'token001',
        {
          number: '5583993128721',
          body: 'teste',
        }
      )
    } catch (error) {
      console.log(error);
      throw new HttpException(error, 500);

    }
  }
}

