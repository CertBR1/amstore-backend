import { Controller, Get, Post, Body, Patch, Param, Delete, Inject, Req } from '@nestjs/common';
import { WebhookService } from './webhook.service';
import { CreateWebhookDto } from './dto/create-webhook.dto';
import { UpdateWebhookDto } from './dto/update-webhook.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Pedido } from 'src/pedido/entities/pedido.entity';
import { Repository } from 'typeorm';
import { Transacao } from 'src/transacao/entities/transacao.entity';
import { MercadoPagoService } from 'src/mercado-pago/mercado-pago.service';
import { ServicoPedido } from 'src/servico-pedido/entities/servico-pedido.entity';
import { HistoricoTransacao } from 'src/transacao/entities/historico-transcao.entity';
import { Fornecedor } from 'src/fornecedor/entities/fornecedor.entity';

@Controller('webhook')
export class WebhookController {
  constructor(
    @InjectRepository(Pedido)
    private readonly pedidoRepository: Repository<Pedido>,
    @InjectRepository(Transacao)
    private readonly transacaoRepository: Repository<Transacao>,
    @InjectRepository(ServicoPedido)
    private readonly servicoPedidoRepository: Repository<ServicoPedido>,
    @InjectRepository(HistoricoTransacao)
    private readonly historicoTransacaoRepository: Repository<HistoricoTransacao>,
    @InjectRepository(Fornecedor)
    private readonly fornecedorRepository: Repository<Fornecedor>,
    private readonly mercadoPagoService: MercadoPagoService,
    private readonly webhookService: WebhookService,
  ) { }

  @Post()
  async create(@Req() req: any) {
    const body = JSON.parse(Buffer.from(req.body, 'base64').toString());
    console.log('Webhook request: ', body);
    switch (body.type) {
      case 'payment': {
        const transacao = await this.transacaoRepository.findOne({
          where: { idTransacao: body.data.id },
          relations: ['idFormaPagamento.configuracao', 'idPedido.idPedido'],
        })
        console.log('transacao: ', transacao);
        const pedidoServico = await this.servicoPedidoRepository.find({
          where: { idPedido: transacao.idPedido.idPedido },
          relations: ['idServico.idFornecedor', 'idPedido']
        })
        console.log('pedidoServico: ', pedidoServico);
        switch (body.data.status) {
          case 'approved': {
            this.historicoTransacaoRepository.create({
              idTransacao: transacao.idTransacao,
              status: 'APPROVADO',
              data: new Date(),
              idPedido: transacao.idPedido.idPedido,
            })
            await this.transacaoRepository.save(transacao)
            break;
          }
          case 'in_process': {
            this.historicoTransacaoRepository.create({
              idTransacao: transacao.idTransacao,
              status: 'EM_PROCESSO',
              data: new Date(),
              idPedido: transacao.idPedido.idPedido,
            })
            await this.transacaoRepository.save(transacao)
            break;
          }
          case 'rejected': {
            this.historicoTransacaoRepository.create({
              idTransacao: transacao.idTransacao,
              status: 'REJEITADO',
              data: new Date(),
              idPedido: transacao.idPedido.idPedido,
            })
            await this.transacaoRepository.save(transacao)
            break;
          }
          case 'pending': {
            this.historicoTransacaoRepository.create({
              idTransacao: transacao.idTransacao,
              status: 'PENDENTE',
              data: new Date(),
              idPedido: transacao.idPedido.idPedido,
            })
            await this.transacaoRepository.save(transacao)
            break;
          }
        }
        break;
      }
    }
  }
}
