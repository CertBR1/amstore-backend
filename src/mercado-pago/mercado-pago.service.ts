import { HttpException, Injectable } from '@nestjs/common';
import { MercadoPagoConfig, Payment, Preference } from 'mercadopago';
@Injectable()
export class MercadoPagoService {
    constructor() { }
    createClient(accessToken: string) {
        return new MercadoPagoConfig({
            accessToken: accessToken,
            options: {
                timeout: 10000
            }
        });
    }
    async criarPagamento(client: any, data: {
        transaction_amount: number,
        description: string,
        payment_method_id: string,
        notification_url: string,
        payer: {
            email: string
        },
    }) {
        console.log(data);

        try {
            const pagamento = new Payment(client);
            return await pagamento.create({ body: data });
        } catch (error) {
            throw new HttpException(error, 500);
        }
    }
    async obterPagamento(client: any, id: number) {
        try {
            const pagamento = new Payment(client);
            const pagamentoEncontrado = await pagamento.get({ id: id });
            return {
                id: pagamentoEncontrado.id,
                status: pagamentoEncontrado.status,
                dataAprovado: pagamentoEncontrado.date_approved,
                valor: pagamentoEncontrado.transaction_amount,
                moeda: pagamentoEncontrado.currency_id,
            }
        } catch (error) {
            throw new HttpException(error, 500);
        }
    }
    async criarPagamentoCartao(client: any, preference: any) {
        try {
            const preference = new Preference(client);
            return await preference.create({
                body: {
                    notification_url: process.env.WEBHOOK_URL,
                    items: [
                        {
                            id: '1',
                            title: 'Meu produto',
                            quantity: 1,
                            unit_price: 25
                        }
                    ],
                }
            });
        } catch (error) {
            throw new HttpException(error, 500);
        }
    }
    async obterStatusPagamento(id: number, client: any) {
        try {
            const pagamento = new Payment(client);
            const pagamentoEncontrado = await pagamento.get({ id: id });
            return pagamentoEncontrado;
        } catch (error) {
            console.log(error);
            throw new HttpException(error, 500);
        }
    }
}