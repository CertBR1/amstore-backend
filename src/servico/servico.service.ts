import { Injectable } from '@nestjs/common';
import { CreateServicoDto } from './dto/create-servico.dto';
import { UpdateServicoDto } from './dto/update-servico.dto';

@Injectable()
export class ServicoService {
  create(createServicoDto: CreateServicoDto) {
    return 'This action adds a new servico';
  }

  findAll() {
    return `This action returns all servico`;
  }

  findOne(id: number) {
    return `This action returns a #${id} servico`;
  }

  update(id: number, updateServicoDto: UpdateServicoDto) {
    return `This action updates a #${id} servico`;
  }

  remove(id: number) {
    return `This action removes a #${id} servico`;
  }

  createInfoAdicionais(createServicoDto: CreateServicoDto) {
    return 'This action adds a new servico';
  }

  findAllInfoAdicionais() {
    return `This action returns all servico`;
  }

  findOneInfoAdicionais(id: number) {
    return `This action returns a #${id} servico`;
  }

  updateInfoAdicionais(id: number, updateServicoDto: UpdateServicoDto) {
    return `This action updates a #${id} servico`;
  }

  createInfoPrincipais(createServicoDto: CreateServicoDto) {
    return 'This action adds a new servico';
  }

  findAllInfoPrincipais() {
    return `This action returns all servico`;
  }

  findOneInfoPrincipais(id: number) {
    return `This action returns a #${id} servico`;
  }

  updateInfoPrincipais(id: number, updateServicoDto: UpdateServicoDto) {
    return `This action updates a #${id} servico`;
  }
}
