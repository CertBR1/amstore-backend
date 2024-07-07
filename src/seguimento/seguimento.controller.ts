import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { SeguimentoService } from './seguimento.service';
import { CreateSeguimentoDto } from './dto/create-seguimento.dto';
import { UpdateSeguimentoDto } from './dto/update-seguimento.dto';
import { CreateTipoSeguimentoDto } from './dto/create-tipo-seguimento';

@Controller('seguimento')
export class SeguimentoController {
  constructor(private readonly seguimentoService: SeguimentoService) { }

  @Post('tipo')
  createTipoSeguimento(@Body() createtipoSeguimentoDto: CreateTipoSeguimentoDto) {
    return this.seguimentoService.createTipoSeguimento(createtipoSeguimentoDto);
  }
  @Get('tipo')
  findAllTipoSeguimento() {
    return this.seguimentoService.findAllTipoSeguimento();
  }
  @Post()
  create(@Body() createSeguimentoDto: CreateSeguimentoDto) {
    return this.seguimentoService.create(createSeguimentoDto);
  }

  @Get()
  findAll() {
    return this.seguimentoService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.seguimentoService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSeguimentoDto: UpdateSeguimentoDto) {
    return this.seguimentoService.update(+id, updateSeguimentoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.seguimentoService.remove(+id);
  }
}
