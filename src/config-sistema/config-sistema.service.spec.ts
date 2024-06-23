import { Test, TestingModule } from '@nestjs/testing';
import { ConfigSistemaService } from './config-sistema.service';

describe('ConfigSistemaService', () => {
  let service: ConfigSistemaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ConfigSistemaService],
    }).compile();

    service = module.get<ConfigSistemaService>(ConfigSistemaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
