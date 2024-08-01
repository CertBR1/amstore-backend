import { Controller, Get, Post, Body, Patch, Param, Delete, Inject, Req, Query, HttpException } from '@nestjs/common';
import { WebhookService } from './webhook.service';
import { CreateWebhookDto } from './dto/create-webhook.dto';
import { UpdateWebhookDto } from './dto/update-webhook.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Pedido } from 'src/pedido/entities/pedido.entity';
import { DataSource, Repository } from 'typeorm';
import { Transacao } from 'src/transacao/entities/transacao.entity';
import { MercadoPagoService } from 'src/mercado-pago/mercado-pago.service';
import { ServicoPedido } from 'src/servico-pedido/entities/servico-pedido.entity';
import { HistoricoTransacao } from 'src/transacao/entities/historico-transcao.entity';
import { Fornecedor } from 'src/fornecedor/entities/fornecedor.entity';
import { AxiosClientService } from 'src/axios-client/axios-client.service';
import { ConfigFormaPagamento } from 'src/pedido/entities/config-forma-pagamento.entity';
import { ServicoSeguimentado } from 'src/servico-seguimentado/entities/servico-seguimentado.entity';
import { StatusPagamento } from 'src/utils/enums/StatusPagamento.enum';
import { StatusPedido } from 'src/utils/enums/StatusPedido.enum';
import { TipoServico } from 'src/utils/enums/TipoServico.enum';

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
    @InjectRepository(ConfigFormaPagamento)
    private readonly configFormaPagamentoRepository: Repository<ConfigFormaPagamento>,
    @InjectRepository(Fornecedor)
    private readonly fornecedorRepository: Repository<Fornecedor>,
    @InjectRepository(ServicoSeguimentado)
    private readonly servicoSeguimentadoRepository: Repository<ServicoSeguimentado>,
    private readonly dataSource: DataSource,
    private readonly mercadoPagoService: MercadoPagoService,
    private readonly webhookService: WebhookService,
    private readonly axiosClient: AxiosClientService
  ) { }

  @Post()
  async create(@Req() req: any, @Query('id') id: string) {
    const body = JSON.parse(Buffer.from(req.body, 'base64').toString());
    console.log('Webhook request: ', body);
    switch (body.type) {
      case 'payment': {
        const queryRunner = this.dataSource.createQueryRunner();
        try {
          const idPayment = body.data.id;
          const configFormaPagamento = await this.configFormaPagamentoRepository.findOne({ where: { status: true } });
          const mercadoPagoClient = this.mercadoPagoService.createClient(configFormaPagamento.key);
          const payment = await this.mercadoPagoService.obterPagamento(mercadoPagoClient, idPayment);
          switch (payment.status) {
            case 'approved': {
              await queryRunner.connect();
              await queryRunner.startTransaction();
              const pedido = await this.pedidoRepository.findOne({ where: { id: +payment.external_reference }, relations: ['servicoPedidos.idServico', 'servicoPedidos.idSeguimento', 'servicoPedidos.idTransacao', 'servicoPedidos.idServico.idFornecedor'] });
              if (!pedido) {
                throw new HttpException('Pedido não encontrado', 404);
              }
              for (const servico of pedido.servicoPedidos) {
                console.log("Executando servico: ", servico);
                if (servico.idSeguimento) {
                  const seguimento = await this.servicoSeguimentadoRepository.findOne({ where: { id: servico.idSeguimento.id }, relations: ['idFornecedor'] });
                  const fornecedor = await this.fornecedorRepository.findOne({ where: { id: seguimento.idFornecedor.id } });
                  //EXECUTAR A CRIAÇÃO DO PEDIDO NO PAINEL ADICIONAR COMENTARIOS FUTURAMENTE
                  let respostaPainel = null
                  if (servico.idServico.tipo === TipoServico.PERSONALIZADO) {
                    respostaPainel = await this.axiosClient.criarPersonalizado(fornecedor.url, fornecedor.key, seguimento.idServicoFornecedor, servico.link, servico.comentarios,)
                  } else {
                    respostaPainel = await this.axiosClient.criarPedido(fornecedor.url, fornecedor.key, {
                      link: servico.link,
                      quantity: servico.quantidadeSolicitada,
                      service: seguimento.idServicoFornecedor,
                    })
                  }
                  if (respostaPainel.order) {
                    await this.historicoTransacaoRepository.save({
                      idPedido: pedido,
                      idTransacao: idPayment,
                      data: new Date(),
                      idServico: respostaPainel.order,
                    });
                    await this.servicoPedidoRepository.save({
                      idTransacao: idPayment,
                      numeroOrdem: respostaPainel.order,
                      status: StatusPedido.PENDENTE,
                      ...servico
                    })
                    await queryRunner.manager.update(Pedido, pedido.id, {
                      statusPagamento: StatusPagamento.PAGO,
                      statusPedido: StatusPedido.PENDENTE,
                    })
                  }
                } else {
                  const fornecedor = await this.fornecedorRepository.findOne({ where: { id: servico.idServico.idFornecedor.id } });
                  let respostaPainel = null
                  if (servico.idServico.tipo === TipoServico.PERSONALIZADO) {
                    respostaPainel = await this.axiosClient.criarPersonalizado(fornecedor.url, fornecedor.key, servico.idServico.idServicoFornecedor, servico.link, servico.comentarios,)
                  } else {
                    respostaPainel = await this.axiosClient.criarPedido(fornecedor.url, fornecedor.key, {
                      link: servico.link,
                      quantity: servico.quantidadeSolicitada,
                      service: servico.idServico.idServicoFornecedor,
                    })
                  }
                  if (respostaPainel.order) {
                    console.log('Resposta do painel: ', respostaPainel);
                    await this.historicoTransacaoRepository.save({
                      idPedido: pedido,
                      idTransacao: idPayment,
                      idServico: respostaPainel.order,
                      status: StatusPagamento.PAGO,
                      data: new Date(),
                    });
                    await queryRunner.manager.update(ServicoPedido, servico.id, {
                      status: StatusPagamento.PAGO,
                      numeroOrdem: respostaPainel.order,
                      dataConclusao: new Date(),
                    })
                    await queryRunner.manager.update(Pedido, pedido.id, {
                      statusPagamento: StatusPagamento.PAGO,
                      statusPedido: StatusPedido.PENDENTE,
                    })
                  }
                }
                await queryRunner.commitTransaction();
                return 'ok';
              }
            }
          }
        } catch (error) {
          console.log(error);
          throw new HttpException('Erro ao processar o pedido', 500);
        } finally {
          await queryRunner.release();
        }
      }
    }
  }
}