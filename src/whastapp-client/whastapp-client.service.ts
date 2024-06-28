import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { CacheManagerService } from 'src/cache-manager/cache-manager.service';

@Injectable()
export class WhastappClientService {
    private genetareCode(count: number) {
        const randomNumbers = [];
        for (let i = 0; i < count; i++) {
            const randomNumber = Math.floor(Math.random() * 10);
            randomNumbers.push(randomNumber);
        }
        return randomNumbers.map((number) => number.toString()).join('');
    }
    constructor(
        private httpService: HttpService,
        private cacheService: CacheManagerService
    ) {

    }

    async enviarCodigo(celular: string) {
        const code = this.genetareCode(6);
        console.log('Codigo Gerado: ', code);
        this.cacheService.set('code', code);
    }
}
