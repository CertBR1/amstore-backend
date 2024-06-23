import { Test, TestingModule } from '@nestjs/testing';
import { ServicoPedidoService } from './servico-pedido.service';

describe('ServicoPedidoService', () => {
  let service: ServicoPedidoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ServicoPedidoService],
    }).compile();

    service = module.get<ServicoPedidoService>(ServicoPedidoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
