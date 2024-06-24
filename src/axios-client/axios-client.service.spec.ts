import { Test, TestingModule } from '@nestjs/testing';
import { AxiosClientService } from './axios-client.service';

describe('AxiosClientService', () => {
  let service: AxiosClientService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AxiosClientService],
    }).compile();

    service = module.get<AxiosClientService>(AxiosClientService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
