import { HttpException, Injectable } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { AdminCred } from 'src/admin/entities/admin.entity';
import { DataSource, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(AdminCred)
    private readonly adminCredRepository: Repository<AdminCred>,
    private readonly jwtService: JwtService,
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
      const jwt = await this.jwtService.sign(payload);
      return { access_token: jwt };
    } catch (error) {
      console.log(error);
      throw new HttpException(error, 500);
    }
  }
}
