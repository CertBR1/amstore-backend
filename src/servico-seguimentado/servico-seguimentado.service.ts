import { HttpException, Injectable } from '@nestjs/common';
import { CreateServicoSeguimentadoDto } from './dto/create-servico-seguimentado.dto';
import { UpdateServicoSeguimentadoDto } from './dto/update-servico-seguimentado.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ServicoSeguimentado } from './entities/servico-seguimentado.entity';
import { DataSource, Repository } from 'typeorm';
import { Servico } from 'src/servico/entities/servico.entity';
import { Fornecedor } from 'src/fornecedor/entities/fornecedor.entity';
import { TipoSeguimento } from 'src/seguimento/entities/tipo-seguimento.entity';
import { Seguimento } from 'src/seguimento/entities/seguimento.entity';

@Injectable()
export class ServicoSeguimentadoService {
  constructor(
    @InjectRepository(ServicoSeguimentado)
    private servicoSeguimentadoRepository: Repository<ServicoSeguimentado>,
    @InjectRepository(Servico)
    private servicoRepository: Repository<Servico>,
    @InjectRepository(Fornecedor)
    private fornecedorRepository: Repository<Fornecedor>,
    @InjectRepository(TipoSeguimento)
    private tipoSeguimentoRepository: Repository<TipoSeguimento>,
    @InjectRepository(Seguimento)
    private seguimentoRepository: Repository<Seguimento>,
    private dataSource: DataSource
  ) { }
  async create(createServicoSeguimentadoDto: CreateServicoSeguimentadoDto) {
    const queryRunner = this.dataSource.createQueryRunner();
    console.log('Serviço seguimentado para criação: ', createServicoSeguimentadoDto)
    try {
      await queryRunner.connect();
      await queryRunner.startTransaction();
      console.log(createServicoSeguimentadoDto.idServico)
      const servico = await this.servicoRepository.findOneBy({
        id: createServicoSeguimentadoDto.idServico
      })
      console.log(servico)
      if (!servico) {
        throw new HttpException('Serviço não encontrado', 404);
      }
      const fornecedor = await this.fornecedorRepository.findOneBy({
        id: createServicoSeguimentadoDto.idFornecedor
      })
      if (!fornecedor) {
        throw new HttpException('Fornecedor não encontrado', 404);
      }
      const tipoSeguimento = await this.tipoSeguimentoRepository.findOneBy({
        id: createServicoSeguimentadoDto.idTipoSeguimento
      })
      if (!tipoSeguimento) {
        throw new HttpException('Tipo de seguimento não encontrado', 404);
      }
      const seguimento = await this.seguimentoRepository.findOneBy({
        id: createServicoSeguimentadoDto.idSeguimento
      })
      if (!seguimento) {
        throw new HttpException('Seguimento não encontrado', 404);
      }
      console.log(servico, fornecedor, tipoSeguimento, seguimento)
      const servicoSeguimentado = this.servicoSeguimentadoRepository.create({
        idServico: servico,
        idTipoSeguimento: tipoSeguimento,
        idSeguimento: seguimento,
        idFornecedor: fornecedor,
        preco: createServicoSeguimentadoDto.preco,
        precoPromocional: createServicoSeguimentadoDto.precoPromocional,
        idServicoFornecedor: createServicoSeguimentadoDto.idServicoFornecedor
      });
      await queryRunner.manager.save(servicoSeguimentado);
      await queryRunner.commitTransaction();
      return servicoSeguimentado;
    } catch (error) {
      console.log(error);
      await queryRunner.rollbackTransaction();
      throw new HttpException(error, 500);
    } finally {
      await queryRunner.release();
    }
  }

  findAll() {
    try {
      return this.servicoSeguimentadoRepository.find({
        relations: {
          idServico: true,
          idTipoSeguimento: true,
          idSeguimento: true,
          idFornecedor: true
        }
      });
    } catch (error) {
      console.log(error);
      throw new HttpException(error, 500);
    }
  }

  findOne(id: number) {
    try {
      return this.servicoSeguimentadoRepository.findOne({
        where: { id },
        relations: {
          idServico: true,
          idTipoSeguimento: true,
          idSeguimento: true,
          idFornecedor: true
        }
      });
    } catch (error) {
      console.log(error);
      throw new HttpException(error, 500);
    }
  }

  async update(id: number, updateServicoSeguimentadoDto: UpdateServicoSeguimentadoDto) {
    const queryRunner = this.dataSource.createQueryRunner();
    try {
      queryRunner.connect();
      queryRunner.startTransaction();
      const servicoSeguimentado = await this.servicoSeguimentadoRepository.findOneBy({ id });
      if (!servicoSeguimentado) {
        throw new HttpException('Serviço não encontrado', 404);
      }
      if (updateServicoSeguimentadoDto.idServico) {
        const servico = await this.servicoRepository.findOneBy({
          id: updateServicoSeguimentadoDto.idServico
        })
        if (!servico) {
          throw new HttpException('Serviço não encontrado', 404);
        }
        servicoSeguimentado.idServico = servico;
      }
      if (updateServicoSeguimentadoDto.idFornecedor) {
        const fornecedor = await this.fornecedorRepository.findOneBy({
          id: updateServicoSeguimentadoDto.idFornecedor
        })
        if (!fornecedor) {
          throw new HttpException('Fornecedor não encontrado', 404);
        }
        servicoSeguimentado.idFornecedor = fornecedor;
      }
      if (updateServicoSeguimentadoDto.idTipoSeguimento) {
        const tipoSeguimento = await this.tipoSeguimentoRepository.findOneBy({
          id: updateServicoSeguimentadoDto.idTipoSeguimento
        })
        if (!tipoSeguimento) {
          throw new HttpException('Tipo de seguimento não encontrado', 404);
        }
        servicoSeguimentado.idTipoSeguimento = tipoSeguimento;
      }
      if (updateServicoSeguimentadoDto.idSeguimento) {
        const seguimento = await this.seguimentoRepository.findOneBy({
          id: updateServicoSeguimentadoDto.idSeguimento
        })
        if (!seguimento) {
          throw new HttpException('Seguimento não encontrado', 404);
        }
        servicoSeguimentado.idSeguimento = seguimento;
      }
      servicoSeguimentado.preco = updateServicoSeguimentadoDto.preco;
      servicoSeguimentado.precoPromocional = updateServicoSeguimentadoDto.precoPromocional;
      await queryRunner.manager.save(servicoSeguimentado);
      await queryRunner.commitTransaction();
      return servicoSeguimentado;
    } catch (error) {
      console.log(error);
      throw new HttpException(error, 500);
    } finally {
      queryRunner.release();
    }
  }

  async remove(id: number) {
    const queryRunner = this.dataSource.createQueryRunner();
    try {
      queryRunner.connect();
      queryRunner.startTransaction();
      const servicoSeguimentado = await this.servicoSeguimentadoRepository.findOneBy({ id });
      if (!servicoSeguimentado) {
        throw new HttpException('Serviço não encontrado', 404);
      }
      await queryRunner.manager.softDelete(ServicoSeguimentado, id);
      await queryRunner.commitTransaction();
      return {
        message: 'Serviço deletado com sucesso',
        nome: servicoSeguimentado.idServico
      };
    } catch (error) {
      console.log(error);
      throw new HttpException(error, 500);
    } finally {
      queryRunner.release();
    }
  }
}
