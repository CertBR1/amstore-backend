import { Injectable } from '@nestjs/common';
import { CreateSubcategoriaDto } from './dto/create-subcategoria.dto';
import { UpdateSubcategoriaDto } from './dto/update-subcategoria.dto';

@Injectable()
export class SubcategoriaService {
  create(createSubcategoriaDto: CreateSubcategoriaDto) {
    return 'This action adds a new subcategoria';
  }

  findAll() {
    return `This action returns all subcategoria`;
  }

  findOne(id: number) {
    return `This action returns a #${id} subcategoria`;
  }

  update(id: number, updateSubcategoriaDto: UpdateSubcategoriaDto) {
    return `This action updates a #${id} subcategoria`;
  }

  remove(id: number) {
    return `This action removes a #${id} subcategoria`;
  }
}
