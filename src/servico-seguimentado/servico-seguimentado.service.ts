import { Injectable } from '@nestjs/common';
import { CreateServicoSeguimentadoDto } from './dto/create-servico-seguimentado.dto';
import { UpdateServicoSeguimentadoDto } from './dto/update-servico-seguimentado.dto';

@Injectable()
export class ServicoSeguimentadoService {
  create(createServicoSeguimentadoDto: CreateServicoSeguimentadoDto) {
    return 'This action adds a new servicoSeguimentado';
  }

  findAll() {
    return `This action returns all servicoSeguimentado`;
  }

  findOne(id: number) {
    return `This action returns a #${id} servicoSeguimentado`;
  }

  update(id: number, updateServicoSeguimentadoDto: UpdateServicoSeguimentadoDto) {
    return `This action updates a #${id} servicoSeguimentado`;
  }

  remove(id: number) {
    return `This action removes a #${id} servicoSeguimentado`;
  }
}
