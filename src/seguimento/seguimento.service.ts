import { Injectable } from '@nestjs/common';
import { CreateSeguimentoDto } from './dto/create-seguimento.dto';
import { UpdateSeguimentoDto } from './dto/update-seguimento.dto';

@Injectable()
export class SeguimentoService {
  create(createSeguimentoDto: CreateSeguimentoDto) {
    return 'This action adds a new seguimento';
  }

  findAll() {
    return `This action returns all seguimento`;
  }

  findOne(id: number) {
    return `This action returns a #${id} seguimento`;
  }

  update(id: number, updateSeguimentoDto: UpdateSeguimentoDto) {
    return `This action updates a #${id} seguimento`;
  }

  remove(id: number) {
    return `This action removes a #${id} seguimento`;
  }
}
