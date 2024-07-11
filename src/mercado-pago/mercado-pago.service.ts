import { HttpException, Injectable } from '@nestjs/common';
import { MercadoPagoConfig, MerchantOrder, Payment, Preference, } from 'mercadopago';
import { MerchantOrderResponse } from 'mercadopago/dist/clients/merchantOrder/commonTypes';
import { PaymentResponse } from 'mercadopago/dist/clients/payment/commonTypes';
import { PreferenceResponse } from 'mercadopago/dist/clients/preference/commonTypes';

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
    async criarPagamentoPix(client: any, data: {
        id: string,
        transaction_amount: number,
        description: string,
        external_reference: string
        payer: {
            email: string
        },
    }): Promise<PaymentResponse> {
        try {
            const payment = new Payment(client);
            const pagamentoCriado = await payment.create(
                {
                    body: {
                        description: data.description,
                        payment_method_id: 'pix',
                        notification_url: process.env.WEBHOOK_URL,
                        transaction_amount: data.transaction_amount,
                        external_reference: data.external_reference,
                        payer: {
                            email: data.payer.email
                        }
                    },
                }
            )
            return pagamentoCriado
        } catch (error) {
            throw new HttpException(error, 500);
        }
    }
    async obterPagamento(client: any, id: number) {
        try {
            const pagamento = new Payment(client);
            const pagamentoEncontrado = await pagamento.get({ id: id });
            return pagamentoEncontrado
            // return {
            //     id: pagamentoEncontrado.id,
            //     status: pagamentoEncontrado.status,
            //     dataAprovado: pagamentoEncontrado.date_approved,
            //     valor: pagamentoEncontrado.transaction_amount,
            //     moeda: pagamentoEncontrado.currency_id,
            // }
        } catch (error) {
            throw new HttpException(error, 500);
        }
    }
    async criarPagamentoCartao(client: any, itemData: {
        id: string,
        title: string,
        quantity: number,
        unit_price: number,
        external_reference: string,
        payer: {
            email: string
        },
    }): Promise<{ merchantOrder: MerchantOrderResponse, preference: PreferenceResponse }> {
        try {
            const preferenceClient = new Preference(client);
            const preference = await preferenceClient.create({
                body: {
                    payment_methods: {
                        excluded_payment_methods: [],
                        excluded_payment_types: [],
                        installments: 12,
                    },
                    external_reference: itemData.external_reference,
                    notification_url: process.env.WEBHOOK_URL,
                    payer: {
                        email: itemData.payer.email
                    },
                    items: [
                        {
                            id: itemData.id,
                            title: itemData.title,
                            quantity: itemData.quantity,
                            unit_price: itemData.unit_price
                        }
                    ],
                }
            });
            const merchantOrder = new MerchantOrder(client);
            const merchantOrderCriado = await merchantOrder.create({
                body: {
                    notification_url: process.env.WEBHOOK_URL,
                    preference_id: preference.id,
                    external_reference: itemData.external_reference,
                    items: [
                        {
                            currency_id: 'BRL',
                            title: itemData.title,
                            description: itemData.title,
                            quantity: itemData.quantity,
                            unit_price: itemData.unit_price
                        }
                    ],
                }
            })
            return {
                merchantOrder: merchantOrderCriado,
                preference: preference
            }
        } catch (error) {
            throw new HttpException(error, 500);
        }
    }
    async obterStatusPagamento(id: string, client: any) {
        try {
            const preference = new Preference(client);
            const preferenceEncontrado = await preference.get({ preferenceId: id });
            return preferenceEncontrado;
        } catch (error) {
            console.log(error);
            throw new HttpException(error, 500);
        }
    }

    async criarMerchantOrder(client: any, data: {
        id: string,
        transaction_amount: number,
        description: string,
        preference_id: string,
        external_reference: string,
        payer: {
            email: string
        },
    }) {
        try {
            const merchantOrder = new MerchantOrder(client);
            return await merchantOrder.create({
                body: {
                    notification_url: process.env.WEBHOOK_URL,
                    preference_id: data.preference_id,
                    external_reference: data.external_reference,
                    items: [
                        {
                            currency_id: 'BRL',
                            title: data.description,
                            description: data.description,
                            quantity: 1,
                            unit_price: data.transaction_amount
                        }
                    ],
                }
            });
        } catch (error) {
            console.log(error);
            throw new HttpException(error, 500);
        }
    }

    async obterMerchantOrder(id: number, client: any) {
        try {
            const merchantOrder = new MerchantOrder(client);
            const merchantOrderEncontrado = await merchantOrder.get({ merchantOrderId: id });
            return merchantOrderEncontrado;
        } catch (error) {
            console.log(error);
            throw new HttpException(error, 500);
        }
    }
}
