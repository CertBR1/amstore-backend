import { Injectable } from '@nestjs/common';
import { CreateConfigSistemaDto } from './dto/create-config-sistema.dto';
import { UpdateConfigSistemaDto } from './dto/update-config-sistema.dto';

@Injectable()
export class ConfigSistemaService {
  create(createConfigSistemaDto: CreateConfigSistemaDto) {
    return 'This action adds a new configSistema';
  }

  findAll() {
    return `This action returns all configSistema`;
  }

  findOne(id: number) {
    return `This action returns a #${id} configSistema`;
  }

  update(id: number, updateConfigSistemaDto: UpdateConfigSistemaDto) {
    return `This action updates a #${id} configSistema`;
  }

  remove(id: number) {
    return `This action removes a #${id} configSistema`;
  }
}
