import { HttpException, Inject, Injectable } from '@nestjs/common';
import { CreateFornecedorDto } from './dto/create-fornecedor.dto';
import { UpdateFornecedorDto } from './dto/update-fornecedor.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Fornecedor } from './entities/fornecedor.entity';
import { DataSource, Repository } from 'typeorm';
import { AxiosClientService } from 'src/axios-client/axios-client.service';

@Injectable()
export class FornecedorService {
  constructor(
    @InjectRepository(Fornecedor)
    private fornecedorRepository: Repository<Fornecedor>,
    private axiosClient: AxiosClientService,
    private dataSource: DataSource
  ) { }
  async create(createFornecedorDto: CreateFornecedorDto) {
    const queryRunner = this.dataSource.createQueryRunner();
    try {
      await queryRunner.connect();
      await queryRunner.startTransaction();
      const resposta = await this.axiosClient.obterSaldo(createFornecedorDto.url, createFornecedorDto.key);
      createFornecedorDto.saldo = resposta.balance;
      createFornecedorDto.moeda = resposta.currency;
      const fornecedor = this.fornecedorRepository.create({
        ...createFornecedorDto,
        status: 'ATIVO',
        cadastro: new Date(),
      });
      await queryRunner.manager.save(fornecedor);
      await queryRunner.commitTransaction();
      return fornecedor;
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
      return await this.fornecedorRepository.find();
    } catch (error) {
      console.log(error);
      throw new HttpException(error, 500);
    }
  }

  async findOne(id: number) {
    try {
      return await this.fornecedorRepository.findOneBy({ id });
    } catch (error) {
      console.log(error);
      throw new HttpException(error, 500);
    }
  }

  async update(id: number, updateFornecedorDto: UpdateFornecedorDto) {
    const queryRunner = this.dataSource.createQueryRunner();
    try {
      await queryRunner.connect();
      await queryRunner.startTransaction();
      const fornecedor = await this.fornecedorRepository.findOneBy({ id });
      if (!fornecedor) {
        throw new HttpException('Fornecedor não encontrado', 404);
      }
      await queryRunner.manager.update(Fornecedor, id, updateFornecedorDto);
      await queryRunner.commitTransaction();
      return await this.fornecedorRepository.findOneBy({ id });
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
      const fornecedor = await this.fornecedorRepository.findOneBy({ id });
      if (!fornecedor) {
        throw new HttpException('Fornecedor não encontrado', 404);
      }
      await queryRunner.manager.delete(Fornecedor, id);
      await queryRunner.commitTransaction();
      return await this.fornecedorRepository.findOneBy({ id });
    } catch (error) {
      console.log(error);
      throw new HttpException(error, 500);
    }
  }
}
