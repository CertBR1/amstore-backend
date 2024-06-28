import { Test, TestingModule } from '@nestjs/testing';
import { WhastappClientService } from './whastapp-client.service';

describe('WhastappClientService', () => {
  let service: WhastappClientService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WhastappClientService],
    }).compile();

    service = module.get<WhastappClientService>(WhastappClientService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
