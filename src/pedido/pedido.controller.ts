import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PedidoService } from './pedido.service';
import { CreatePedidoDto } from './dto/create-pedido.dto';
import { UpdatePedidoDto } from './dto/update-pedido.dto';
import { CreateFormaPagamentoDto } from './dto/create-forma-pagamento.dto';

@Controller('pedido')
export class PedidoController {
  constructor(private readonly pedidoService: PedidoService) { }

  @Post('forma-pagamento')
  createFormaPagamento(@Body() createFormaPagamento: CreateFormaPagamentoDto) {
    return this.pedidoService.createFormaPagamento(createFormaPagamento);
  }
  @Patch('forma-pagamento/:id')
  updateFormaPagamento(@Param('id') id: string, @Body() updateFormaPagamento: CreateFormaPagamentoDto) {
    return this.pedidoService.updateFormaPagamento(+id, updateFormaPagamento);
  }

  @Get('forma-pagamento')
  findAllFormaPagamento() {
    return this.pedidoService.findAllFormaPagamento();
  }
  @Post()
  create(@Body() createPedidoDto: CreatePedidoDto) {
    return this.pedidoService.create(createPedidoDto);
  }

  @Get()
  findAll() {
    return this.pedidoService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.pedidoService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePedidoDto: UpdatePedidoDto) {
    return this.pedidoService.update(+id, updatePedidoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.pedidoService.remove(+id);
  }
}
