import { HttpException, Injectable } from '@nestjs/common';
import { CreateSeguimentoDto } from './dto/create-seguimento.dto';
import { UpdateSeguimentoDto } from './dto/update-seguimento.dto';
import { Seguimento } from './entities/seguimento.entity';
import { DataSource, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateTipoSeguimentoDto } from './dto/create-tipo-seguimento';
import { TipoSeguimento } from './entities/tipo-seguimento.entity';

@Injectable()
export class SeguimentoService {
  constructor(
    @InjectRepository(Seguimento)
    private seguimentoRepository: Repository<Seguimento>,
    @InjectRepository(TipoSeguimento)
    private tipoSeguimentoRepository: Repository<TipoSeguimento>,
    private dataSource: DataSource
  ) { }
  async create(createSeguimentoDto: CreateSeguimentoDto) {
    const queryRunner = this.dataSource.createQueryRunner();
    try {
      await queryRunner.connect();
      await queryRunner.startTransaction();
      const seguimento = this.seguimentoRepository.create(createSeguimentoDto);
      await queryRunner.manager.save(seguimento);
      await queryRunner.commitTransaction();
      return seguimento;
    } catch (error) {
      console.log(error)
      await queryRunner.rollbackTransaction();
      throw new HttpException(error, 500)
    } finally {
      await queryRunner.release();
    }
  }

  findAll() {
    try {
      return this.seguimentoRepository.find({
        relations: { servicosSeguimentados: true, tiposSeguimento: true }
      });
    } catch (error) {
      console.log(error);
      throw new HttpException(error, 500);
    }
  }

  findOne(id: number) {
    try {
      return this.seguimentoRepository.findOne({ where: { id }, relations: { servicosSeguimentados: true, tiposSeguimento: true } });
    } catch (error) {
      console.log(error)
      throw new HttpException(error, 500)
    }
  }

  async update(id: number, updateSeguimentoDto: UpdateSeguimentoDto) {
    const queryRunner = this.dataSource.createQueryRunner();
    try {
      await queryRunner.connect();
      await queryRunner.startTransaction();
      const seguimento = await this.seguimentoRepository.findOneBy({ id });
      if (!seguimento) {
        throw new HttpException('Seguimento não encontrado', 404);
      }
      await queryRunner.manager.update(Seguimento, id, updateSeguimentoDto);
      await queryRunner.commitTransaction();
      return await this.seguimentoRepository.findOneBy({ id });
    } catch (error) {
      console.log(error)
      throw new HttpException(error, 500)
    }
  }

  async remove(id: number) {
    const queryRunner = this.dataSource.createQueryRunner();
    try {
      await queryRunner.connect();
      await queryRunner.startTransaction();
      const seguimento = await this.seguimentoRepository.findOneBy({ id });
      if (!seguimento) {
        throw new HttpException('Seguimento não encontrado', 404);
      }
      await queryRunner.manager.delete(Seguimento, id);
      await queryRunner.commitTransaction();
      return {
        message: 'Seguimento deletado com sucesso',
        nome: seguimento.nome
      };
    } catch (error) {
      console.log(error)
      await queryRunner.rollbackTransaction();
      throw new HttpException(error, 500)
    } finally {
      await queryRunner.release();
    }
  }
  async createTipoSeguimento(createtipoSeguimentoDto: CreateTipoSeguimentoDto) {
    const queryRunner = this.dataSource.createQueryRunner();
    try {
      await queryRunner.connect();
      await queryRunner.startTransaction();
      const seguimento = await this.seguimentoRepository.findOneBy({ id: createtipoSeguimentoDto.idSeguimento });
      if (!seguimento) {
        throw new HttpException('Seguimento não encontrado', 404);
      }
      const tipoSeguimento = this.tipoSeguimentoRepository.create({
        nome: createtipoSeguimentoDto.nome,
        idSeguimento: seguimento
      });
      await queryRunner.manager.save(tipoSeguimento);
      await queryRunner.commitTransaction();
      return tipoSeguimento;
    } catch (error) {
      console.log(error)
      throw new HttpException(error, 500)
    }
  }

  async findAllTipoSeguimento() {
    try {
      return this.tipoSeguimentoRepository.find();
    } catch (error) {
      console.log(error)
      throw new HttpException(error, 500)
    }
  }

}
