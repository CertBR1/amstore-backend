import { Module } from '@nestjs/common';
import { CacheManagerService } from './cache-manager.service';
import { CacheManagerController } from './cache-manager.controller';
import { CacheModule } from '@nestjs/cache-manager';

@Module({
  imports: [CacheModule.register({
    isGlobal: true,
    store: 'memory',
  })],
  controllers: [CacheManagerController],
  providers: [CacheManagerService],
  exports: [CacheManagerService]
})
export class CacheManagerModule { }
