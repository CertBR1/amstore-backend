import { Test, TestingModule } from '@nestjs/testing';
import { SeguimentoService } from './seguimento.service';

describe('SeguimentoService', () => {
  let service: SeguimentoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SeguimentoService],
    }).compile();

    service = module.get<SeguimentoService>(SeguimentoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
