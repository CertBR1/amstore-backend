import { Injectable } from '@nestjs/common';
import { CreateWhastappClientDto } from './dto/create-whastapp-client.dto';
import { UpdateWhastappClientDto } from './dto/update-whastapp-client.dto';

@Injectable()
export class WhastappClientService {
  create(createWhastappClientDto: CreateWhastappClientDto) {
    return 'This action adds a new whastappClient';
  }

  findAll() {
    return `This action returns all whastappClient`;
  }

  findOne(id: number) {
    return `This action returns a #${id} whastappClient`;
  }

  update(id: number, updateWhastappClientDto: UpdateWhastappClientDto) {
    return `This action updates a #${id} whastappClient`;
  }

  remove(id: number) {
    return `This action removes a #${id} whastappClient`;
  }
}
