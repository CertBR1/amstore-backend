import { Test, TestingModule } from '@nestjs/testing';
import { ServicoSeguimentadoService } from './servico-seguimentado.service';

describe('ServicoSeguimentadoService', () => {
  let service: ServicoSeguimentadoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ServicoSeguimentadoService],
    }).compile();

    service = module.get<ServicoSeguimentadoService>(ServicoSeguimentadoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
