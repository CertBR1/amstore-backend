import { HttpException, Injectable } from '@nestjs/common';
import { CreateServicoPedidoDto } from './dto/create-servico-pedido.dto';
import { UpdateServicoPedidoDto } from './dto/update-servico-pedido.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Servico } from 'src/servico/entities/servico.entity';
import { ServicoPedido } from './entities/servico-pedido.entity';
import { DataSource, Repository } from 'typeorm';
import { Pedido } from 'src/pedido/entities/pedido.entity';
import { Transacao } from 'src/transacao/entities/transacao.entity';

@Injectable()
export class ServicoPedidoService {
  constructor(
    @InjectRepository(Servico)
    private servicoRepository: Repository<Servico>,
    @InjectRepository(ServicoPedido)
    private servicoPedidoRepository: Repository<ServicoPedido>,
    @InjectRepository(Pedido)
    private pedidoRepository: Repository<Pedido>,
    @InjectRepository(Transacao)
    private transacaoRepository: Repository<Transacao>,
    private dataSource: DataSource
  ) { }
  async create(createServicoPedidoDto: CreateServicoPedidoDto) {
    const queryRunner = this.dataSource.createQueryRunner();
    try {
      await queryRunner.connect();
      await queryRunner.startTransaction();
      const servicoPedido = this.servicoPedidoRepository.create({
        idPedido: await this.pedidoRepository.findOneBy({ id: createServicoPedidoDto.idPedido }),
        idServico: await this.servicoRepository.findOneBy({ id: createServicoPedidoDto.idServico }),
        link: createServicoPedidoDto.link,
        quantidadeSolicitada: createServicoPedidoDto.quantidadeSolicitada,
        quantidadeEntregue: createServicoPedidoDto.quantidadeEntregue,
      });
      await this.servicoPedidoRepository.save(servicoPedido);
    } catch (error) {
      console.log(error);
      await queryRunner.rollbackTransaction();
      throw new HttpException(error, 500);
    } finally {
      await queryRunner.release();
    }
  }

  findAll() {
    return `This action returns all servicoPedido`;
  }

  findOne(id: number) {
    return `This action returns a #${id} servicoPedido`;
  }

  update(id: number, updateServicoPedidoDto: UpdateServicoPedidoDto) {
    return `This action updates a #${id} servicoPedido`;
  }

  remove(id: number) {
    return `This action removes a #${id} servicoPedido`;
  }
}
