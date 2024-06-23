import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ServicoSeguimentadoService } from './servico-seguimentado.service';
import { CreateServicoSeguimentadoDto } from './dto/create-servico-seguimentado.dto';
import { UpdateServicoSeguimentadoDto } from './dto/update-servico-seguimentado.dto';

@Controller('servico-seguimentado')
export class ServicoSeguimentadoController {
  constructor(private readonly servicoSeguimentadoService: ServicoSeguimentadoService) {}

  @Post()
  create(@Body() createServicoSeguimentadoDto: CreateServicoSeguimentadoDto) {
    return this.servicoSeguimentadoService.create(createServicoSeguimentadoDto);
  }

  @Get()
  findAll() {
    return this.servicoSeguimentadoService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.servicoSeguimentadoService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateServicoSeguimentadoDto: UpdateServicoSeguimentadoDto) {
    return this.servicoSeguimentadoService.update(+id, updateServicoSeguimentadoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.servicoSeguimentadoService.remove(+id);
  }
}
