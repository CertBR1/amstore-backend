import { Module } from '@nestjs/common';
import { ConfigSistemaService } from './config-sistema.service';
import { ConfigSistemaController } from './config-sistema.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigSistema } from './entities/config-sistema.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ConfigSistema
    ]),
  ],
  controllers: [ConfigSistemaController],
  providers: [ConfigSistemaService],
})
export class ConfigSistemaModule { }
