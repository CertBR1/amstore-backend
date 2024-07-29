import { Body, Controller, Post } from '@nestjs/common';
import { EmailService } from './email.service';
import { CreateConfigEmailDto } from './dto/create-config-email.dto';

@Controller('email')
export class EmailController {
  constructor(private readonly emailService: EmailService) { }
  @Post('config')
  async criarConfiguracaoEmail(@Body() createConfigEmailDto: CreateConfigEmailDto) {
    return this.emailService.criarConfiguracaoEmail(createConfigEmailDto);
  }
}
