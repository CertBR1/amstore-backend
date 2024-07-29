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
        const idPayment = body.data.id;
        const configFormaPagamento = await this.configFormaPagamentoRepository.findOne({ where: { status: true } });
        const client = this.mercadoPagoService.createClient(configFormaPagamento.key);
        const payment = await this.mercadoPagoService.obterPagamento(client, idPayment);
        switch (payment.status) {
          case 'approved': {
            try {
              await queryRunner.connect();
              await queryRunner.startTransaction();
              console.log('Processando pedido: ' + payment.external_reference + '-' + new Date());
              const pedido = await this.pedidoRepository.find({ where: { id: +payment.external_reference } });
              if (pedido) {
                const resposta = []
                for (let i = 0; i < pedido.length; i++) {
                  const pedidoEntity = pedido[i];
                  const servicoPedido = await this.servicoPedidoRepository.findOne({ where: { idPedido: pedidoEntity }, relations: ['idServico.idFornecedor'] });
                  let fornecedor = null
                  let seguimento = null
                  if (servicoPedido.idSeguimento) {
                    seguimento = this.servicoSeguimentadoRepository.findOneBy({ id: servicoPedido.idSeguimento.id });
                    fornecedor = await this.fornecedorRepository.findOneBy({ id: seguimento.idFornecedor.id });
                  } else {
                    fornecedor = await this.fornecedorRepository.findOneBy({ id: servicoPedido.idServico.idFornecedor.id });
                  }
                  console.log('Executando pedido:' + pedidoEntity.id + new Date().getUTCMilliseconds());
                  console.log('Chamando painel de seguidores com o id de servico: ' + servicoPedido.idServico.idFornecedor + 'no painel de seguidores: ' + fornecedor.url);
                  const repostaPainel = await this.axiosClient.criarPedido(fornecedor.url, fornecedor.key, {
                    link: servicoPedido.link,
                    service: seguimento ? seguimento.idServicoFornecedor : servicoPedido.idServico.idServicoFornecedor,
                    quantity: servicoPedido.quantidadeSolicitada,
                  })
                  console.log("Resposta do painel: " + repostaPainel, + "para o pedido: " + pedidoEntity.id);
                  if (!repostaPainel.error) {
                    await queryRunner.manager.update(Pedido, pedidoEntity.id, {
                      statusPedido: 'Aprovado',
                      statusPagamento: 'Aprovado',
                    })
                    await queryRunner.manager.save(HistoricoTransacao, {
                      idTransacao: idPayment,
                      status: 'Aprovado',
                      idPedido: pedidoEntity,
                      data: new Date(),
                    })
                    await queryRunner.manager.update(Transacao, servicoPedido.id, {
                      dataAprovacao: new Date(),
                      dataStatus: new Date(),
                    })
                    await queryRunner.manager.update(ServicoPedido, servicoPedido.id, {
                      numeroOrdem: repostaPainel.order,
                    })
                    console.log("Adicionado o numero de ordem: " + repostaPainel.id + "para o servico: " + servicoPedido.idServico.idFornecedor);
                    resposta.push({
                      link: servicoPedido.link,
                      numeroDeOrdem: repostaPainel.order,
                    });
                  } else {
                    await queryRunner.manager.update(Pedido, pedidoEntity.id, {
                      statusPedido: 'ERRO',
                      statusPagamento: 'ERRO',
                    })
                    await queryRunner.manager.save(HistoricoTransacao, {
                      idTransacao: idPayment,
                      status: 'ERRO',
                      idPedido: pedidoEntity,
                      data: new Date(),
                    })
                  }
                  await queryRunner.commitTransaction();
                  return 'OK';
                }
              }
            } catch (error) {
              console.log(error);
              throw new HttpException('Erro ao processar o pedido', 500);
            } finally {
              await queryRunner.release();
            }
          }
            break;
        }
      }
    }
  }
}
