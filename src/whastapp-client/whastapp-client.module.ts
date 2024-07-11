import { forwardRef, Module } from '@nestjs/common';
import { WhastappClientService } from './whastapp-client.service';
import { WhastappClientController } from './whastapp-client.controller';
import { AxiosClientModule } from 'src/axios-client/axios-client.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WhastappClient } from './entities/whastapp-client.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([WhastappClient]),
    forwardRef(() => AxiosClientModule)
  ],
  controllers: [WhastappClientController],
  providers: [WhastappClientService],
  exports: [WhastappClientService]
})
export class WhastappClientModule { }
