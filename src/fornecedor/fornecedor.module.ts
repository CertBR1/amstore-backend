import { Module } from '@nestjs/common';
import { FornecedorService } from './fornecedor.service';
import { FornecedorController } from './fornecedor.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Fornecedor } from './entities/fornecedor.entity';
import { AxiosClientModule } from 'src/axios-client/axios-client.module';
import { AxiosClientService } from 'src/axios-client/axios-client.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Fornecedor
    ]),
    AxiosClientModule
  ],

  controllers: [FornecedorController],
  providers: [FornecedorService],

})
export class FornecedorModule { }
