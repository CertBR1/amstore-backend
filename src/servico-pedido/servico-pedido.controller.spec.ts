import { Test, TestingModule } from '@nestjs/testing';
import { ServicoPedidoController } from './servico-pedido.controller';
import { ServicoPedidoService } from './servico-pedido.service';

describe('ServicoPedidoController', () => {
  let controller: ServicoPedidoController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ServicoPedidoController],
      providers: [ServicoPedidoService],
    }).compile();

    controller = module.get<ServicoPedidoController>(ServicoPedidoController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
