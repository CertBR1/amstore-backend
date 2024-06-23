import { Test, TestingModule } from '@nestjs/testing';
import { SeguimentoController } from './seguimento.controller';
import { SeguimentoService } from './seguimento.service';

describe('SeguimentoController', () => {
  let controller: SeguimentoController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SeguimentoController],
      providers: [SeguimentoService],
    }).compile();

    controller = module.get<SeguimentoController>(SeguimentoController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
