import { Test, TestingModule } from '@nestjs/testing';
import { ServicoSeguimentadoController } from './servico-seguimentado.controller';
import { ServicoSeguimentadoService } from './servico-seguimentado.service';

describe('ServicoSeguimentadoController', () => {
  let controller: ServicoSeguimentadoController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ServicoSeguimentadoController],
      providers: [ServicoSeguimentadoService],
    }).compile();

    controller = module.get<ServicoSeguimentadoController>(ServicoSeguimentadoController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
