import { Test, TestingModule } from '@nestjs/testing';
import { WhastappClientController } from './whastapp-client.controller';
import { WhastappClientService } from './whastapp-client.service';

describe('WhastappClientController', () => {
  let controller: WhastappClientController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WhastappClientController],
      providers: [WhastappClientService],
    }).compile();

    controller = module.get<WhastappClientController>(WhastappClientController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
