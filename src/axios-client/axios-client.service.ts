import { HttpService } from '@nestjs/axios';
import { HttpException, Injectable } from '@nestjs/common';

@Injectable()
export class AxiosClientService {
    constructor(
        private readonly axiosService: HttpService
    ) {

    }
    async obterSaldo(url: string, key: string): Promise<{
        balance: string,
        currency: string
    }> {
        try {
            const resposta = await this.axiosService.axiosRef.post(url, {
                "key": key,
                "action": "balance",
            });
            return resposta.data;
        } catch (error) {
            console.log(error);
            throw new HttpException(error, 500);
        }
    }
    async oberServicos(url: string, key: string): Promise<any> {
        try {
            const resposta = await this.axiosService.axiosRef.post(url, {
                "key": key,
                "action": "services",
            });
            return resposta.data;
        } catch (error) {
            console.log(error);
            throw new HttpException(error, 500);
        }
    }
}
