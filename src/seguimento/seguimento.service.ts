import { HttpException, Injectable } from '@nestjs/common';
import { CreateSeguimentoDto } from './dto/create-seguimento.dto';
import { UpdateSeguimentoDto } from './dto/update-seguimento.dto';
import { Seguimento } from './entities/seguimento.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class SeguimentoService {
  constructor(
    @InjectRepository(Seguimento)
    private seguimentoRepository: Repository<Seguimento>,
  ) { }
  create(createSeguimentoDto: CreateSeguimentoDto) {
    try {

    } catch (error) {
      console.log(error)
      throw new HttpException(error, 500)
    }
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
