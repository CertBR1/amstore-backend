import { Injectable } from '@nestjs/common';
import { CreateServicoPedidoDto } from './dto/create-servico-pedido.dto';
import { UpdateServicoPedidoDto } from './dto/update-servico-pedido.dto';

@Injectable()
export class ServicoPedidoService {
  create(createServicoPedidoDto: CreateServicoPedidoDto) {
    return 'This action adds a new servicoPedido';
  }

  findAll() {
    return `This action returns all servicoPedido`;
  }

  findOne(id: number) {
    return `This action returns a #${id} servicoPedido`;
  }

  update(id: number, updateServicoPedidoDto: UpdateServicoPedidoDto) {
    return `This action updates a #${id} servicoPedido`;
  }

  remove(id: number) {
    return `This action removes a #${id} servicoPedido`;
  }
}
