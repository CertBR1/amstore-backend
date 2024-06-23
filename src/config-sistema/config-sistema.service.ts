import { HttpException, Injectable } from '@nestjs/common';
import { CreateConfigSistemaDto } from './dto/create-config-sistema.dto';
import { UpdateConfigSistemaDto } from './dto/update-config-sistema.dto';
import { ConfigSistema } from './entities/config-sistema.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class ConfigSistemaService {
  constructor(
    @InjectRepository(ConfigSistema)
    private configSistemaRepository: Repository<ConfigSistema>,
    private dataSource: DataSource
  ) { }
  async create(createConfigSistemaDto: CreateConfigSistemaDto) {
    const queryRunner = this.dataSource.createQueryRunner();
    try {
      await queryRunner.connect();
      await queryRunner.startTransaction();
      const configSistema = this.configSistemaRepository.create(createConfigSistemaDto);
      await queryRunner.manager.save(configSistema);
      await queryRunner.commitTransaction();
      return configSistema;
    } catch (error) {
      console.log(error);
      await queryRunner.rollbackTransaction();
      throw new HttpException(error, 500);
    } finally {
      await queryRunner.release();
    }
  }

  async findAll() {
    try {
      return await this.configSistemaRepository.find();
    } catch (error) {
      console.log(error);
      throw new HttpException(error, 500);
    }
  }

  async findOne(id: number) {
    try {
      return await this.configSistemaRepository.findOneBy({ id });
    } catch (error) {
      console.log(error);
      throw new HttpException(error, 500);
    }
  }

  async update(id: number, updateConfigSistemaDto: UpdateConfigSistemaDto) {
    const queryRunner = this.dataSource.createQueryRunner();
    try {
      await queryRunner.connect();
      await queryRunner.startTransaction();
      const configSistema = await this.configSistemaRepository.findOneBy({ id });
      if (!configSistema) {
        throw new HttpException('ConfigSistema não encontrado', 404);
      }
      await queryRunner.manager.update(ConfigSistema, id, updateConfigSistemaDto);
      await queryRunner.commitTransaction();
      return await this.configSistemaRepository.findOneBy({ id });
    } catch (error) {
      console.log(error);
      await queryRunner.rollbackTransaction();
      throw new HttpException(error, 500);
    } finally {
      await queryRunner.release();
    }
  }

  async remove(id: number) {
    const queryRunner = this.dataSource.createQueryRunner();
    try {
      await queryRunner.connect();
      await queryRunner.startTransaction();
      const configSistema = await this.configSistemaRepository.findOneBy({ id });
      if (!configSistema) {
        throw new HttpException('ConfigSistema não encontrado', 404);
      }
      await queryRunner.manager.delete(ConfigSistema, id);
      await queryRunner.commitTransaction();
      return {
        message: 'ConfigSistema deletado com sucesso',
        id: configSistema.id,
        nome: configSistema.nomeLoja
      };
    } catch (error) {
      console.log(error);
      await queryRunner.rollbackTransaction();
      throw new HttpException(error, 500);
    } finally {
      await queryRunner.release();
    }
  }
}
