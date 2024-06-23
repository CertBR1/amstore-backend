import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { SubcategoriaService } from './subcategoria.service';
import { CreateSubcategoriaDto } from './dto/create-subcategoria.dto';
import { UpdateSubcategoriaDto } from './dto/update-subcategoria.dto';

@Controller('subcategoria')
export class SubcategoriaController {
  constructor(private readonly subcategoriaService: SubcategoriaService) {}

  @Post()
  create(@Body() createSubcategoriaDto: CreateSubcategoriaDto) {
    return this.subcategoriaService.create(createSubcategoriaDto);
  }

  @Get()
  findAll() {
    return this.subcategoriaService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.subcategoriaService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSubcategoriaDto: UpdateSubcategoriaDto) {
    return this.subcategoriaService.update(+id, updateSubcategoriaDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.subcategoriaService.remove(+id);
  }
}
