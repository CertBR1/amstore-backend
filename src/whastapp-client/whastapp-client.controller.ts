import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { WhastappClientService } from './whastapp-client.service';
import { CreateWhastappClientDto } from './dto/create-whastapp-client.dto';
import { UpdateWhastappClientDto } from './dto/update-whastapp-client.dto';

@Controller('whastapp-client')
export class WhastappClientController {
  constructor(private readonly whastappClientService: WhastappClientService) { }

  @Post()
  create(@Body() createWhastappClientDto: CreateWhastappClientDto) {
    return this.whastappClientService.create(createWhastappClientDto);
  }

  @Get()
  findAll() {
    return this.whastappClientService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.whastappClientService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateWhastappClientDto: UpdateWhastappClientDto) {
    return this.whastappClientService.update(+id, updateWhastappClientDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.whastappClientService.remove(+id);
  }
}
