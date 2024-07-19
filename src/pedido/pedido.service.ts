import { HttpException, Injectable } from '@nestjs/common';
import { CreatePedidoDto } from './dto/create-pedido.dto';
import { UpdatePedidoDto } from './dto/update-pedido.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Pedido } from './entities/pedido.entity';
import { Transacao } from 'src/transacao/entities/transacao.entity';
import { DataSource, Repository } from 'typeorm';
import { ServicoPedido } from 'src/servico-pedido/entities/servico-pedido.entity';
import { Servico } from 'src/servico/entities/servico.entity';
import { AxiosClientService } from 'src/axios-client/axios-client.service';
import { MercadoPagoService } from 'src/mercado-pago/mercado-pago.service';
import { CreateFormaPagamentoDto } from './dto/create-forma-pagamento.dto';
import { FormaPagamento } from './entities/forma-pagamento';
import { ConfigFormaPagamento } from './entities/config-forma-pagamento.entity';
import { Cliente } from 'src/cliente/entities/cliente.entity';
import { HistoricoTransacao } from 'src/transacao/entities/historico-transcao.entity';
import { PreferenceResponse } from 'mercadopago/dist/clients/preference/commonTypes';
import { PaymentResponse } from 'mercadopago/dist/clients/payment/commonTypes';

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
    @InjectRepository(FormaPagamento)
    private readonly formaPagamentoRepository: Repository<FormaPagamento>,
    @InjectRepository(ConfigFormaPagamento)
    private readonly configFormaPagamentoRepository: Repository<ConfigFormaPagamento>,
    @InjectRepository(HistoricoTransacao)
    private readonly historicoTransacaoRepository: Repository<HistoricoTransacao>,
    @InjectRepository(Cliente)
    private readonly clienteRepository: Repository<Cliente>,
    private readonly axiosClient: AxiosClientService,
    private readonly mercadoPagoService: MercadoPagoService,
    private dataSource: DataSource
  ) { }
  async create(createPedidoDto: CreatePedidoDto, cliente: any) {
    const queryRunner = this.dataSource.createQueryRunner();
    try {

      await queryRunner.connect();
      await queryRunner.startTransaction();
      let valor = 0;
      let descricao = '';
      let clienteEncontrado = await this.clienteRepository.findOne({
        where: {
          id: cliente.id
        }
      });
      if (!clienteEncontrado) {
        throw new HttpException('Cliente não encontrado', 404);
      }
      clienteEncontrado.dataUltimaCompra = new Date();
      const pedido = this.pedidoRepository.create(
        {
          data: new Date(),
          statusPedido: 'Pendente',
          statusPagamento: 'Pendente',
          valor: 0,
          idCliente: clienteEncontrado,
          origem: createPedidoDto.origem || 'SITE'
        }
      );
      for (const servico of createPedidoDto.servicos) {
        const servicoEntity = await this.servicoRepository.findOne({
          where: {
            id: servico.idServico
          },
          relations: {
            idFornecedor: true,
            servicosSeguimentados: true
          }
        });
        if (!servicoEntity) {
          throw new HttpException(`Serviço não ${servico.idServico} encontrado`, 404);
        }
        if (servico.idSeguimento) {
          console.log(servicoEntity.servicosSeguimentados);
          console.log(servico.idSeguimento)
          const servicoSeguimentado = servicoEntity.servicosSeguimentados.find(x => x.id == servico.idSeguimento);
          await this.pedidoRepository.save(pedido);
          const servicoPedido = this.servicoPedidoRepository.create({
            idPedido: pedido,
            idServico: servicoEntity,
            idSeguimento: servicoSeguimentado,
            link: createPedidoDto.link,
            quantidadeSolicitada: servico.quantidadeSolicitada,
          });
          descricao += `${servicoEntity.descricao} - Quantidade: ${servico.quantidadeSolicitada} \n`;
          valor += servicoEntity.precoPromocional == 0 ? (servicoEntity.preco / 1000) * servico.quantidadeSolicitada : (servicoEntity.precoPromocional / 1000) * servico.quantidadeSolicitada;
          await this.servicoPedidoRepository.save(servicoPedido);
        } else {
          await this.pedidoRepository.save(pedido);
          const servicoPedido = this.servicoPedidoRepository.create({
            idPedido: pedido,
            idServico: servicoEntity,
            link: createPedidoDto.link,
            quantidadeSolicitada: servico.quantidadeSolicitada,
          });
          descricao += `${servicoEntity.descricao} - Quantidade: ${servico.quantidadeSolicitada} \n`;
          valor += servicoEntity.precoPromocional == 0 ? (servicoEntity.preco / 1000) * servico.quantidadeSolicitada : (servicoEntity.precoPromocional / 1000) * servico.quantidadeSolicitada;
          await this.servicoPedidoRepository.save(servicoPedido);
        }
      }
      await queryRunner.manager.update(Pedido, pedido.id, { valor });
      const formaPagamento = await this.formaPagamentoRepository.findOne({
        where: {
          id: createPedidoDto.idFormaPagamento
        }
      })
      const configFormaPagamento = await this.configFormaPagamentoRepository.findOne({
        where: {
          status: true,
        }
      })
      const clientePagamento = this.mercadoPagoService.createClient(configFormaPagamento.key)
      let pagamento = {} as any
      if (formaPagamento.metodoPagamento === 'pix') {
        console.log(createPedidoDto, cliente);
        pagamento = await this.mercadoPagoService.criarPagamentoPix(
          clientePagamento,
          {
            transaction_amount: valor,
            external_reference: pedido.id.toString(),
            description: descricao,
            id: pedido.id.toString(),
            payer: {
              email: clienteEncontrado.email,
            },
          },
        )
        const transacao = this.transacaoRepository.create({
          idTransacao: pagamento.id.toString(),
          dataSolicitacao: new Date(),
          idFormaPagamento: formaPagamento,
          valor: valor,
          idPedido: pedido
        });
        await this.transacaoRepository.save(transacao);
        const historico = await queryRunner.manager.create(HistoricoTransacao, {
          idTransacao: transacao.idTransacao,
          data: new Date(),
          status: 'Pendente',
          idPedido: transacao.idPedido
        })
        await queryRunner.manager.save(historico);
        await queryRunner.commitTransaction();
        // return {
        //   id: pedido.id,
        //   cliente: clienteEncontrado,
        //   link: pagamento.init_point,

        // };
        return pagamento;
      } else if (formaPagamento.metodoPagamento === 'cartao') {
        pagamento = await this.mercadoPagoService.criarPagamentoCartao(
          clientePagamento,
          {
            id: pedido.id.toString(),
            quantity: 1,
            external_reference: pedido.id.toString(),
            unit_price: valor,
            title: descricao,
            payer: {
              email: clienteEncontrado.email,
            },
          }
        )
        console.log(pagamento);
        const transacao = this.transacaoRepository.create({
          dataSolicitacao: new Date(),
          idTransacao: pagamento.merchantOrder.id.toString(),
          idFormaPagamento: formaPagamento,
          valor: valor,
          idPedido: pedido
        });
        await this.transacaoRepository.save(transacao);
        const historico = await queryRunner.manager.create(HistoricoTransacao, {
          idTransacao: transacao.idTransacao,
          data: new Date(),
          status: 'Pendente',
          idPedido: transacao.idPedido
        })
        await queryRunner.manager.save(historico);
        await queryRunner.commitTransaction();
        return pagamento;
      } else {
        throw new HttpException('Forma de pagamento inválida', 404);
      }
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
      return this.pedidoRepository.find({
        relations: {
          idCliente: true,
          historicoTransacao: true,
        }
      });
    } catch (error) {
      throw new HttpException(error, 500);
    }
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
  async createFormaPagamento(createFormaPagamento: CreateFormaPagamentoDto) {
    const queryRunner = this.dataSource.createQueryRunner();
    try {
      await queryRunner.connect();
      await queryRunner.startTransaction();
      const formaPagamento = this.formaPagamentoRepository.create(createFormaPagamento);
      await this.formaPagamentoRepository.save(formaPagamento);
      const configFormaPagamento = this.configFormaPagamentoRepository.create({
        formaPagamento: formaPagamento,
        key: createFormaPagamento.configuracao.key,
        nome: createFormaPagamento.configuracao.nome,
        status: createFormaPagamento.status,
      })
      await this.configFormaPagamentoRepository.save(configFormaPagamento);
      await queryRunner.commitTransaction();
      return formaPagamento;
    } catch (error) {
      console.log(error);
      await queryRunner.rollbackTransaction();
      throw new HttpException(error, 500);
    }
  }
  async findAllFormaPagamento() {
    return await this.formaPagamentoRepository.find({ relations: { configuracao: true } });
  }


  async updateFormaPagamento(id: number, updateFormaPagamento: CreateFormaPagamentoDto) {
    const queryRunner = this.dataSource.createQueryRunner();
    try {
      await queryRunner.connect();
      await queryRunner.startTransaction();
      const formaPagamento = await this.formaPagamentoRepository.findOne({ where: { id }, relations: { configuracao: true } });
      if (!formaPagamento) {
        throw new HttpException('Forma de pagamento não encontrada', 404);
      }
      await this.formaPagamentoRepository.update({ id }, {
        descricao: updateFormaPagamento.descricao,
        status: updateFormaPagamento.status,
      });
      await queryRunner.commitTransaction();
      return await this.formaPagamentoRepository.findOne({ where: { id }, relations: { configuracao: true } });
    } catch (error) {
      console.log(error);
      await queryRunner.rollbackTransaction();
      throw new HttpException(error, 500);
    } finally {
      await queryRunner.release();
    }
  }
}

