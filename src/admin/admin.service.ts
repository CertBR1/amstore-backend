import { HttpException, Injectable } from '@nestjs/common';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { AdminCred } from './entities/admin.entity';
import { DataSource, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(AdminCred)
    private adminRepository: Repository<AdminCred>,
    private dataSource: DataSource
  ) { }
  async create(createAdminDto: CreateAdminDto) {
    const queryRunner = this.dataSource.createQueryRunner();
    try {
      await queryRunner.connect();
      await queryRunner.startTransaction();
      const salt = await bcrypt.genSalt();
      const hashedPassword = await bcrypt.hash(createAdminDto.senha, salt);
      createAdminDto.senha = hashedPassword;
      const admin = this.adminRepository.create(createAdminDto);
      await queryRunner.manager.save(admin);
      await queryRunner.commitTransaction();
      return {
        nome: admin.nome,
        usuario: admin.usuario
      };
    } catch (error) {
      console.log(error)
      await queryRunner.rollbackTransaction();
      if (error.code === '23505') {
        throw new HttpException('Usuário ja existe', 400)
      }
      throw new HttpException(error, 500)
    } finally {
      await queryRunner.release();
    }
  }

  async findAll() {
    try {
      return this.adminRepository.find();
    } catch (error) {
      console.log(error)
      throw new HttpException(error, 500)
    }
  }

  async findOne(id: number) {
    try {
      return this.adminRepository.findOneBy({ id })
    } catch (error) {
      console.log(error)
      throw new HttpException(error, 500)
    }
  }

  async update(id: number, updateAdminDto: UpdateAdminDto) {
    const queryRunner = this.dataSource.createQueryRunner();
    try {
      await queryRunner.connect();
      await queryRunner.startTransaction();
      const admin = await this.adminRepository.findOneBy({ id });
      if (!admin) {
        throw new HttpException('Administrador não encontrado', 404)
      }
      if (updateAdminDto.senha) {
        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(updateAdminDto.senha, salt);
        updateAdminDto.senha = hashedPassword;
      }
      await queryRunner.manager.update(AdminCred, id, {
        nome: updateAdminDto.nome,
        senha: updateAdminDto.senha,
        usuario: updateAdminDto.usuario,
      });
      await queryRunner.commitTransaction();
      const adminAtualizado = await this.adminRepository.findOneBy({ id })
      return {
        nome: adminAtualizado.nome,
        usuario: adminAtualizado.usuario
      }
    } catch (error) {
      console.log(error)
      await queryRunner.rollbackTransaction();
      throw new HttpException(error, 500)
    } finally {
      await queryRunner.release();
    }
  }

  async remove(id: number) {
    const queryRunner = this.dataSource.createQueryRunner();
    try {
      await queryRunner.connect();
      await queryRunner.startTransaction();
      const admin = await this.adminRepository.findOneBy({ id });
      if (!admin) {
        throw new HttpException('Administrador não encontrado', 404)
      }
      await queryRunner.manager.delete(AdminCred, id);
      await queryRunner.commitTransaction();
      return {
        message: 'Administrador deletado com sucesso',
        nome: admin.nome,
        usuario: admin.usuario
      }
    } catch (error) {
      console.log(error);
      await queryRunner.rollbackTransaction();
      throw new HttpException(error, 500)
    } finally {
      await queryRunner.release();
    }
  }
}
