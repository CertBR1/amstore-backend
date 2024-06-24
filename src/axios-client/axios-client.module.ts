import { Module } from '@nestjs/common';
import { AxiosClientService } from './axios-client.service';
import { AxiosClientController } from './axios-client.controller';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    HttpModule
  ],
  controllers: [AxiosClientController],
  providers: [AxiosClientService],
  exports: [AxiosClientService]
})
export class AxiosClientModule { }
