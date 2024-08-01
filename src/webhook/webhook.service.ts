import { HttpException, Injectable } from '@nestjs/common';
import { CreateWebhookDto } from './dto/create-webhook.dto';
import { UpdateWebhookDto } from './dto/update-webhook.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Pedido } from 'src/pedido/entities/pedido.entity';
import { DataSource, In, Repository } from 'typeorm';
import { ServicoPedido } from 'src/servico-pedido/entities/servico-pedido.entity';
import { AxiosClientService } from 'src/axios-client/axios-client.service';
import { StatusPedido } from 'src/utils/enums/StatusPedido.enum';
import { StatusPagamento } from 'src/utils/enums/StatusPagamento.enum';
import { Cron, CronExpression } from '@nestjs/schedule';
import * as _ from 'lodash';
@Injectable()
export class WebhookService {
  constructor(
    @InjectRepository(Pedido)
    private readonly pedidoRepository: Repository<Pedido>,
    @InjectRepository(ServicoPedido)
    private readonly servicoPedidoRepository: Repository<ServicoPedido>,
    private axiosCliente: AxiosClientService,
    private dataSource: DataSource
  ) { }
  create(createWebhookDto: CreateWebhookDto) {
    return 'This action adds a new webhook';
  }

  findAll() {
    return `This action returns all webhook`;
  }

  findOne(id: number) {
    return `This action returns a #${id} webhook`;
  }

  update(id: number, updateWebhookDto: UpdateWebhookDto) {
    return `This action updates a #${id} webhook`;
  }

  remove(id: number) {
    return `This action removes a #${id} webhook`;
  }

  @Cron(CronExpression.EVERY_10_MINUTES)
  async verificarStatusPedido() {
    const queryRunner = this.dataSource.createQueryRunner();
    console.log("Verificar status de pedidos")
    try {
      await queryRunner.connect();
      await queryRunner.startTransaction();
      const pedidos = await this.pedidoRepository.find({
        where: {
          statusPedido: In([StatusPedido.PENDENTE, StatusPedido.EM_PROGRESSO, StatusPedido.EM_PROCESSAMENTO]),
          statusPagamento: StatusPagamento.PAGO
        },
        relations: [
          'servicoPedidos.idServico.idFornecedor',
          'servicoPedidos.idSeguimento',
        ]
      })
      for (const pedido of pedidos) {
        for (const servico of pedido.servicoPedidos) {
          const response = await this.axiosCliente.obterStatusDeServico(
            servico.idServico.idFornecedor.url,
            servico.idServico.idFornecedor.key,
            servico.numeroOrdem
          )
          console.log("Response do painel: ", response, 'para o pedido: ', pedido.id, 'ordem de serviço: ', servico.numeroOrdem)
          if (response.status && response.status !== '') {
            response.status = response.status.toLowerCase()
          }
          if (response.status == "canceled" || response.status == "cancel") {
            const servicoPedido = await this.servicoPedidoRepository.findOneBy({ id: servico.id })
            servicoPedido.status = StatusPedido.CANCELADO
            servicoPedido.dataConclusao = new Date()
            if (response.charge) {
              servico.custo = response.charge
            }
            if (response.start_count) {
              servico.quantidadeInicial = response.start_count
            }
            if (response.remains) {
              servico.quantidadeRestante = response.remains
            }
            await this.servicoPedidoRepository.save(servicoPedido)
          } else if (response.status == 'complete' || response.status == 'completed') {
            const servicoPedido = await this.servicoPedidoRepository.findOneBy({ id: servico.id })
            servicoPedido.status = StatusPedido.FINALIZADO
            servicoPedido.dataConclusao = new Date()
            if (response.charge) {
              servico.custo = response.charge
            }
            if (response.start_count) {
              servico.quantidadeInicial = response.start_count
            }
            if (response.remains) {
              servico.quantidadeRestante = response.remains
            }
            await this.servicoPedidoRepository.save(servicoPedido)
          } else if (response.status == 'pending' || response.status == 'fail') {
            const servicoPedido = await this.servicoPedidoRepository.findOneBy({ id: servico.id })
            servicoPedido.status = StatusPedido.PENDENTE
            if (response.charge) {
              servico.custo = response.charge
            }
            if (response.start_count) {
              servico.quantidadeInicial = response.start_count
            }
            if (response.remains) {
              servico.quantidadeRestante = response.remains
            }
            await this.servicoPedidoRepository.save(servicoPedido)
          } else if (response.status == 'inprogress') {
            const servicoPedido = await this.servicoPedidoRepository.findOneBy({ id: servico.id })
            servicoPedido.status = StatusPedido.EM_PROGRESSO
            if (response.charge) {
              servico.custo = response.charge
            }
            if (response.start_count) {
              servico.quantidadeInicial = response.start_count
            }
            if (response.remains) {
              servico.quantidadeRestante = response.remains
            }
            await this.servicoPedidoRepository.save(servicoPedido)
          } else if (response.status == 'processing') {
            const servicoPedido = await this.servicoPedidoRepository.findOneBy({ id: servico.id })
            servicoPedido.status = StatusPedido.EM_PROCESSAMENTO
            if (response.charge) {
              servico.custo = response.charge
            }
            if (response.start_count) {
              servico.quantidadeInicial = response.start_count
            }
            if (response.remains) {
              servico.quantidadeRestante = response.remains
            }
            await this.servicoPedidoRepository.save(servicoPedido)
          } else if (response.status == "partial") {
            const servicoPedido = await this.servicoPedidoRepository.findOneBy({ id: servico.id })
            servicoPedido.status = StatusPedido.PARCIAL
            if (response.charge) {
              servico.custo = response.charge
            }
            if (response.start_count) {
              servico.quantidadeInicial = response.start_count
            }
            if (response.remains) {
              servico.quantidadeRestante = response.remains
            }
            servicoPedido.dataConclusao = new Date()
            await this.servicoPedidoRepository.save(servicoPedido)
          }
        }
        await queryRunner.commitTransaction();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        const pedidoEntity = await this.pedidoRepository.findOne({ where: { id: pedido.id }, relations: ['servicoPedidos.idServico',] })
        const emAndamento = _.some(pedidoEntity.servicoPedidos, { status: StatusPedido.PENDENTE || StatusPedido.EM_PROGRESSO || StatusPedido.EM_PROCESSAMENTO });
        const cancelado = _.every(pedidoEntity.servicoPedidos, { status: StatusPedido.CANCELADO });
        const finalizado = _.every(pedidoEntity.servicoPedidos, { status: StatusPedido.FINALIZADO });
        if (emAndamento) {
          pedidoEntity.statusPedido = StatusPedido.EM_PROCESSAMENTO
        } else if (cancelado) {
          pedidoEntity.statusPedido = StatusPedido.CANCELADO
        } else if (finalizado) {
          pedidoEntity.statusPedido = StatusPedido.FINALIZADO
        } else {
          pedidoEntity.statusPedido = StatusPedido.PARCIAL
        }
        await this.pedidoRepository.save(pedidoEntity)
        await queryRunner.commitTransaction();
        await queryRunner.release();
        return
      }
    } catch (error) {
      console.log(error);
      await queryRunner.rollbackTransaction();
      throw new HttpException(error, 500);
    } finally {
      await queryRunner.release();
    }
  }
}

