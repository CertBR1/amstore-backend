import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ServicoPedidoService } from './servico-pedido.service';
import { CreateServicoPedidoDto } from './dto/create-servico-pedido.dto';
import { UpdateServicoPedidoDto } from './dto/update-servico-pedido.dto';

@Controller('servico-pedido')
export class ServicoPedidoController {
  constructor(private readonly servicoPedidoService: ServicoPedidoService) {}

  @Post()
  create(@Body() createServicoPedidoDto: CreateServicoPedidoDto) {
    return this.servicoPedidoService.create(createServicoPedidoDto);
  }

  @Get()
  findAll() {
    return this.servicoPedidoService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.servicoPedidoService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateServicoPedidoDto: UpdateServicoPedidoDto) {
    return this.servicoPedidoService.update(+id, updateServicoPedidoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.servicoPedidoService.remove(+id);
  }
}
