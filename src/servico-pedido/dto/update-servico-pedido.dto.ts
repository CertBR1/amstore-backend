import { PartialType } from '@nestjs/mapped-types';
import { CreateServicoPedidoDto } from './create-servico-pedido.dto';

export class UpdateServicoPedidoDto extends PartialType(CreateServicoPedidoDto) {}
