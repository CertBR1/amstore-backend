import { Controller } from '@nestjs/common';
import { WhastappClientService } from './whastapp-client.service';

@Controller('whastapp-client')
export class WhastappClientController {
  constructor(private readonly whastappClientService: WhastappClientService) {}
}
