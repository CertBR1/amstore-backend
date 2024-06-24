import { HttpException, Injectable } from '@nestjs/common';
import { CreateTransacaoDto } from './dto/create-transacao.dto';
import { UpdateTransacaoDto } from './dto/update-transacao.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Transacao } from './entities/transacao.entity';
import { DataSource, Repository } from 'typeorm';
import { Pedido } from 'src/pedido/entities/pedido.entity';
import { FormaPagamento } from 'src/pedido/entities/forma-pagamento';

@Injectable()
export class TransacaoService {
  constructor(
    @InjectRepository(Transacao)
    private transacaoRepository: Repository<Transacao>,
    @InjectRepository(Pedido)
    private pedidoRepository: Repository<Pedido>,
    @InjectRepository(FormaPagamento)
    private formaPagamentoRepository: Repository<FormaPagamento>,
    private dataSource: DataSource,

  ) { }
  async create(createTransacaoDto: CreateTransacaoDto) {
    const queryRunner = this.dataSource.createQueryRunner();
    try {
      await queryRunner.connect();
      await queryRunner.startTransaction();
      const transacao = this.transacaoRepository.create({
        idTransacao: createTransacaoDto.idTransacao,
        idPedido: await this.pedidoRepository.findOneBy({ id: createTransacaoDto.idPedido }),
        valor: createTransacaoDto.valor,
        dataSolicitacao: createTransacaoDto.dataSolicitacao,
        dataStatus: createTransacaoDto.dataStatus,
        dataAprovacao: createTransacaoDto.dataAprovacao,
        idFormaPagamento: await this.formaPagamentoRepository.findOneBy({ id: createTransacaoDto.idFormaPagamento }),
      });
      await queryRunner.manager.save(transacao);
      await queryRunner.commitTransaction();
      return transacao;
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
      return await this.transacaoRepository.find();
    } catch (error) {
      console.log(error);
      throw new HttpException(error, 500);
    }
  }

  async findOne(id: number) {
    try {
      return await this.transacaoRepository.findOneBy({ id });
    } catch (error) {
      console.log(error);
      throw new HttpException(error, 500);
    }
  }

  async update(id: number, updateTransacaoDto: UpdateTransacaoDto) {
    const queryRunner = this.dataSource.createQueryRunner();
    try {
      await queryRunner.connect();
      await queryRunner.startTransaction();
      const transacao = await this.transacaoRepository.findOneBy({ id });
      if (!transacao) {
        throw new HttpException('Transacao não encontrada', 404);
      }
      await queryRunner.manager.update(Transacao, id, {
        dataAprovacao: updateTransacaoDto.dataAprovacao,

      });
      await queryRunner.commitTransaction();
      return await this.transacaoRepository.findOneBy({ id });
    } catch (error) {
      console.log(error);
      await queryRunner.rollbackTransaction();
      throw new HttpException(error, 500);
    } finally {
      await queryRunner.release();
    }
  }

  async remove(id: number) {
    return `This action removes a #${id} transacao`;
  }
}
