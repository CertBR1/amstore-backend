import { HttpException, Injectable } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { AdminCred } from 'src/admin/entities/admin.entity';
import { DataSource, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';
import { Cliente } from 'src/cliente/entities/cliente.entity';
import { WhastappClientService } from 'src/whastapp-client/whastapp-client.service';
import { AxiosClientService } from 'src/axios-client/axios-client.service';
import { EmailService } from 'src/email/email.service';
import { CacheManagerService } from 'src/cache-manager/cache-manager.service';
import { Functions } from 'src/utils/func.util';
import { CodeVerificationDto } from './dto/code-verification.dto';
import { ConfigSistema } from 'src/config-sistema/entities/config-sistema.entity';
@Injectable()
export class AuthService {

  constructor(
    @InjectRepository(AdminCred)
    private readonly adminCredRepository: Repository<AdminCred>,
    @InjectRepository(Cliente)
    private readonly clienteRepository: Repository<Cliente>,
    @InjectRepository(ConfigSistema)
    private readonly configSistemaRepository: Repository<ConfigSistema>,
    private readonly emailService: EmailService,
    private readonly jwtService: JwtService,
    private readonly axiosClient: AxiosClientService,
    private readonly cacheManagerService: CacheManagerService,
    private readonly whastappClientService: WhastappClientService,
    private dataSource: DataSource,
  ) { }
  async login(createAuthDto: CreateAuthDto) {
    try {
      const usuario = await this.adminCredRepository.findOne({
        where: { usuario: createAuthDto.usuario },
      })
      if (!usuario) {
        throw new HttpException('Usuário não encontrado', 404);
      }
      if (!bcrypt.compareSync(createAuthDto.senha, usuario.senha)) {
        throw new HttpException('Senha inválida', 401);
      }
      const payload = { id: usuario.id, nome: usuario.nome, usuario: usuario.usuario };
      const secret = `${process.env.JWT_SECRET}admin`;
      const jwt = await this.jwtService.sign(payload, { secret: secret });
      return { access_token: jwt };
    } catch (error) {
      console.log(error);
      throw new HttpException(error, 500);
    }
  }
  async validarCodigo(codeDto: CodeVerificationDto) {
    try {
      const loginPor = codeDto.email ? codeDto.email : codeDto.whatsapp;
      const code = await this.cacheManagerService.get(loginPor);
      if (!code) {
        throw new HttpException('Código expirou', 401);
      }
      if (code !== codeDto.codigo) {
        throw new HttpException('Código inválido', 401);
      }
      const cliente = await this.clienteRepository.findOne({
        where: { email: codeDto.email },
      })
      if (!cliente) {
        throw new HttpException('Cliente não encontrado', 404);
      }
      return {
        cliente_token: this.jwtService.sign({ id: cliente.id, nome: cliente.nome, email: cliente.email }, { secret: process.env.JWT_SECRET }),
        nome: cliente.nome,
        id: cliente.id
      };
    } catch (error) {
      console.log(error);
      throw new HttpException(error, 500);
    }
  }

  async whatsappLogin(LoginDto: LoginDto) {
    console.log(LoginDto);
    try {
      const cliente = await this.clienteRepository.findOne({
        where: { whatsapp: LoginDto.whatsapp },
      })
      if (!cliente) {
        throw new HttpException('Cliente não encontrado', 404);
      }
      const codigo = Functions.genetareCode(6);
      const info = await this.whastappClientService.enviarMensagem(
        {
          number: cliente.whatsapp,
          body: `Olá *${cliente.nome}*, seu codigo de verificação: *${codigo}*`
        });
      await this.cacheManagerService.set(cliente.whatsapp, codigo);
      return info;
    } catch (error) {
      console.log(error);
      throw new HttpException(error, 500);
    }
  }

  async emailLogin(LoginDto: LoginDto) {
    try {
      const cliente = await this.clienteRepository.findOne({
        where: { email: LoginDto.email },
      })
      if (!cliente) {
        throw new HttpException('Cliente não encontrado', 404);
      }
      const codigo = Functions.genetareCode(6);
      const info = await this.emailService.enviarCodigo(codigo, cliente.email);
      await this.cacheManagerService.set(cliente.email, codigo);
      return info;
    } catch (error) {
      console.log(error);
      throw new HttpException(error, 500);
    }
  }

}
