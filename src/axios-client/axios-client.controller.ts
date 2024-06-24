import { Controller, Get } from '@nestjs/common';
import { AxiosClientService } from './axios-client.service';

@Controller('axios-client')
export class AxiosClientController {
  constructor(private readonly axiosClientService: AxiosClientService) { }
  @Get('teste')
  async testFunc() {
    return await this.axiosClientService.obterSaldo('https://painelamsocial.com/api/v2', '6e3e849acc870137457d03408796b294');
  }
}

