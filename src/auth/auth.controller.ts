import { Controller, Get, Post, Body, Patch, Param, Delete, HttpException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { LoginDto } from './dto/login.dto';
import { CodeVerificationDto } from './dto/code-verification.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }
  @Post('login')
  login(@Body() createAuthDto: CreateAuthDto) {
    return this.authService.login(createAuthDto);
  }
  @Post('cliente-login')
  async emailLogin(@Body() LoginDto: LoginDto) {
    if (LoginDto.email) {
      return await this.authService.emailLogin(LoginDto);
    } else if (LoginDto.whatsapp) {
      console.log("LoginDto.whatsapp", LoginDto.whatsapp);
      return await this.authService.whatsappLogin(LoginDto);
    } else {
      throw new HttpException('Login inválido', 400);
    }
  }
  @Post('validar-codigo')
  validarCodigo(@Body() codeDto: CodeVerificationDto) {
    return this.authService.validarCodigo(codeDto);
  }
}
