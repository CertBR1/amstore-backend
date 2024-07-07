import { forwardRef, Module } from '@nestjs/common';
import { WhastappClientService } from './whastapp-client.service';
import { WhastappClientController } from './whastapp-client.controller';
import { AxiosClientModule } from 'src/axios-client/axios-client.module';

@Module({
  imports: [

  ],
  controllers: [WhastappClientController],
  providers: [WhastappClientService],
})
export class WhastappClientModule { }
