import { HttpException, Injectable } from '@nestjs/common';
import { CreatePedidoDto } from './dto/create-pedido.dto';
import { UpdatePedidoDto } from './dto/update-pedido.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Pedido } from './entities/pedido.entity';
import { Transacao } from 'src/transacao/entities/transacao.entity';
import { DataSource, Repository } from 'typeorm';
import { ServicoPedido } from 'src/servico-pedido/entities/servico-pedido.entity';
import { Servico } from 'src/servico/entities/servico.entity';

@Injectable()
export class PedidoService {
  constructor(
    @InjectRepository(Pedido)
    private readonly pedidoRepository: Repository<Pedido>,
    @InjectRepository(Transacao)
    private readonly transacaoRepository: Repository<Transacao>,
    @InjectRepository(ServicoPedido)
    private readonly servicoPedidoRepository: Repository<ServicoPedido>,
    @InjectRepository(Servico)
    private readonly servicoRepository: Repository<Servico>,

    private dataSource: DataSource
  ) { }
  async create(createPedidoDto: CreatePedidoDto) {
    const queryRunner = this.dataSource.createQueryRunner();
    const servicoPedido = this.servicoPedidoRepository.create({

    })
    try {
      await queryRunner.connect();
      await queryRunner.startTransaction();
      let valor = 0;
      const pedido = this.pedidoRepository.create(
        {
          data: new Date(),
        }
      );
      for (const servico of createPedidoDto.servicos) {
        const servicoEntity = await this.servicoRepository.findOneBy({
          id: servico.idServico,
        })
        if (!servicoEntity) {
          throw new HttpException('Serviço não encontrado', 404);
        }
        servicoPedido.idServico = servicoEntity;
        servicoPedido.idPedido = pedido;
        servicoPedido.quantidadeSolicitada = servico.quantidadeSolicitada;

        valor += servicoEntity.preco;
      }
      return 'falta implementar a chamada de serviço no painel e criar a transacao no mercado pago e banco de dados';
    } catch (error) {
      console.log(error);
      await queryRunner.rollbackTransaction();
      throw new HttpException(error, 500);
    } finally {
      await queryRunner.release();
    }
  }

  findAll() {
    return `This action returns all pedido`;
  }

  findOne(id: number) {
    return `This action returns a #${id} pedido`;
  }

  update(id: number, updatePedidoDto: UpdatePedidoDto) {
    return `This action updates a #${id} pedido`;
  }

  remove(id: number) {
    return `This action removes a #${id} pedido`;
  }
}
