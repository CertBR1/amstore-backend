import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { EmailService } from './email.service';
import { CreateConfigEmailDto } from './dto/create-config-email.dto';

@Controller('email')
export class EmailController {
  constructor(private readonly emailService: EmailService) { }
  @Post('config')
  async criarConfiguracaoEmail(@Body() createConfigEmailDto: CreateConfigEmailDto) {
    return this.emailService.criarConfiguracaoEmail(createConfigEmailDto);
  }
  @Get('config')
  async getConfiguracaoEmail() {
    return this.emailService.getConfiguracaoEmail();
  }
  @Patch('config/:id')
  async updateConfiguracaoEmail(@Param('id') id: number, @Body() updateConfigEmailDto: CreateConfigEmailDto) {
    return this.emailService.updateConfiguracaoEmail(id, updateConfigEmailDto);
  }
}
