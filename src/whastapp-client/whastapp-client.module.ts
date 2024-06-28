import { Module } from '@nestjs/common';
import { WhastappClientService } from './whastapp-client.service';
import { WhastappClientController } from './whastapp-client.controller';
import { HttpModule } from '@nestjs/axios';
import { CacheManagerModule } from 'src/cache-manager/cache-manager.module';

@Module({
  imports: [
    HttpModule,
    CacheManagerModule
  ],
  controllers: [WhastappClientController],
  providers: [WhastappClientService],
  exports: [WhastappClientService]
})
export class WhastappClientModule { }
