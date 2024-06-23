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
      if (error.code === 'ER_DUP_ENTRY') {
        throw new HttpException('Usuário ja existe', 400)
      }
      throw new HttpException(error, 500)
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

  update(id: number, updateAdminDto: UpdateAdminDto) {
    return `This action updates a #${id} admin`;
  }

  remove(id: number) {
    return `This action removes a #${id} admin`;
  }
}
