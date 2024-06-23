import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ConfigSistemaService } from './config-sistema.service';
import { CreateConfigSistemaDto } from './dto/create-config-sistema.dto';
import { UpdateConfigSistemaDto } from './dto/update-config-sistema.dto';

@Controller('config-sistema')
export class ConfigSistemaController {
  constructor(private readonly configSistemaService: ConfigSistemaService) {}

  @Post()
  create(@Body() createConfigSistemaDto: CreateConfigSistemaDto) {
    return this.configSistemaService.create(createConfigSistemaDto);
  }

  @Get()
  findAll() {
    return this.configSistemaService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.configSistemaService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateConfigSistemaDto: UpdateConfigSistemaDto) {
    return this.configSistemaService.update(+id, updateConfigSistemaDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.configSistemaService.remove(+id);
  }
}
