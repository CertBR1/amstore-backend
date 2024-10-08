import { Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';

@Injectable()
export class CacheManagerService {
    constructor(
        @Inject('CACHE_MANAGER')
        private cacheManager: Cache
    ) { }
    async set(key: string, value: any) {
        return await this.cacheManager.set(key, value)
    }
    async get(key: string) {
        return await this.cacheManager.get(key)
    }
    async del(key: string) {
        return await this.cacheManager.del(key)
    }
}
