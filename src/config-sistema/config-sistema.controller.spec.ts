import { Test, TestingModule } from '@nestjs/testing';
import { ConfigSistemaController } from './config-sistema.controller';
import { ConfigSistemaService } from './config-sistema.service';

describe('ConfigSistemaController', () => {
  let controller: ConfigSistemaController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ConfigSistemaController],
      providers: [ConfigSistemaService],
    }).compile();

    controller = module.get<ConfigSistemaController>(ConfigSistemaController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
