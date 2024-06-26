import { HttpException, Injectable } from '@nestjs/common';
import { CreateClienteDto } from './dto/create-cliente.dto';
import { UpdateClienteDto } from './dto/update-cliente.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Cliente } from './entities/cliente.entity';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class ClienteService {

  constructor(
    @InjectRepository(Cliente)
    private clienteRepository: Repository<Cliente>,
    private dataSource: DataSource
  ) { }
  async create(createClienteDto: CreateClienteDto) {
    const queryRunner = this.dataSource.createQueryRunner();
    try {
      await queryRunner.connect();
      await queryRunner.startTransaction();
      const cliente = this.clienteRepository.create(createClienteDto);
      await queryRunner.manager.save(cliente);
      await queryRunner.commitTransaction();
      return cliente;
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
      return await this.clienteRepository.find();
    } catch (error) {
      console.log(error);
      throw new HttpException(error, 500);
    }
  }

  async findOne(id: number) {
    try {
      return await this.clienteRepository.findOneBy({ id });
    } catch (error) {
      console.log(error);
      throw new HttpException(error, 500);
    }
  }

  async update(id: number, updateClienteDto: UpdateClienteDto) {
    const queryRunner = this.dataSource.createQueryRunner();
    try {
      await queryRunner.connect();
      await queryRunner.startTransaction();
      const cliente = await this.clienteRepository.findOneBy({ id });
      if (!cliente) {
        throw new HttpException('Cliente não encontrado', 404);
      }
      await queryRunner.manager.update(Cliente, id, updateClienteDto);
      await queryRunner.commitTransaction();
      return await this.clienteRepository.findOneBy({ id });
    } catch (error) {
      console.log(error);
      throw new HttpException(error, 500);
    }
  }

  async remove(id: number) {
    const queryRunner = this.dataSource.createQueryRunner();
    try {
      await queryRunner.connect();
      await queryRunner.startTransaction();
      const cliente = await this.clienteRepository.findOneBy({ id });
      if (!cliente) {
        throw new HttpException('Cliente não encontrado', 404);
      }
      await queryRunner.manager.delete(Cliente, id);
      await queryRunner.commitTransaction();
      return {
        id: cliente.id,
        message: 'Cliente deletado com sucesso',
        nome: cliente.nome,
      };
    } catch (error) {
      console.log(error);
      throw new HttpException(error, 500);
    }
  }
  login(createClienteDto: CreateClienteDto) {
    throw new Error('Ainda nao implementado: Devera enviar um codigo por email ou whatsapp');
  }
}