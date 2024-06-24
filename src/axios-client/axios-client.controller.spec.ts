import { Test, TestingModule } from '@nestjs/testing';
import { AxiosClientController } from './axios-client.controller';
import { AxiosClientService } from './axios-client.service';

describe('AxiosClientController', () => {
  let controller: AxiosClientController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AxiosClientController],
      providers: [AxiosClientService],
    }).compile();

    controller = module.get<AxiosClientController>(AxiosClientController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
