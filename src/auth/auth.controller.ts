import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
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
  @Post('email-login')
  async emailLogin(@Body() LoginDto: LoginDto) {
    return await this.authService.emailLogin(LoginDto);
  }
  @Post('validar-codigo')
  validarCodigo(@Body() codeDto: CodeVerificationDto) {

    return this.authService.validarCodigo(codeDto);
  }
}
