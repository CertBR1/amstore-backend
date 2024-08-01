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
import { CreateConfigPagamentoDto } from './dto/create-config-pagamento.dto';
import { UpdateConfigPagamentoDto } from './dto/update-config-pagamento-dto';
import { MeioPagamento } from 'src/utils/enums/MeioPagamento.enum';
import { StatusPedido } from 'src/utils/enums/StatusPedido.enum';
import { StatusPagamento } from 'src/utils/enums/StatusPagamento.enum';
import { TipoServico } from 'src/utils/enums/TipoServico.enum';

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
    console.log("Criando pedido: ", createPedidoDto);
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
          statusPedido: StatusPedido.CRIADO,
          statusPagamento: StatusPagamento.PENDENTE,
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
        let comentarios = '';
        if (servicoEntity.tipo === TipoServico.PERSONALIZADO) {
          console.log('Salvando comentarios para pedido com serviço personalizado', servico.comentarios);
          comentarios = servico.comentarios.join('\n');
        }
        if (servico.idSeguimento && servico.idSeguimento > 0) {
          console.log('=>', servicoEntity.servicosSeguimentados, '=>', servico.idSeguimento);
          const servicoSeguimentado = servicoEntity.servicosSeguimentados.find(x => x.id == servico.idSeguimento);
          console.log('Servico Seguimentado Selecionado=>', servicoSeguimentado)
          await this.pedidoRepository.save(pedido);
          const servicoPedido = this.servicoPedidoRepository.create({
            idPedido: pedido,
            idServico: servicoEntity,
            idSeguimento: servicoSeguimentado,
            status: StatusPedido.CRIADO,
            link: servico.link,
            quantidadeSolicitada: servico.quantidadeSolicitada,
            valorServico: servicoSeguimentado.precoPromocional == 0 ? (servicoSeguimentado.preco / 1000) : (servicoSeguimentado.precoPromocional / 1000),
            comentarios: comentarios !== '' ? comentarios : null
          });
          descricao += `${servicoEntity.nome} - Quantidade: ${servico.quantidadeSolicitada} \n`;
          valor += servicoSeguimentado.precoPromocional == 0 ? (servicoSeguimentado.preco / 1000) * servico.quantidadeSolicitada : (servicoSeguimentado.precoPromocional / 1000) * servico.quantidadeSolicitada;
          await this.servicoPedidoRepository.save(servicoPedido);
        } else {
          await this.pedidoRepository.save(pedido);
          const servicoPedido = this.servicoPedidoRepository.create({
            idPedido: pedido,
            idServico: servicoEntity,
            status: StatusPedido.CRIADO,
            link: servico.link,
            quantidadeSolicitada: servico.quantidadeSolicitada,
            comentarios: comentarios !== '' ? comentarios : null,
            valorServico: servicoEntity.precoPromocional == 0 ? (servicoEntity.preco / 1000) : (servicoEntity.precoPromocional / 1000),
          });
          descricao += `${servicoEntity.nome} - Quantidade: ${servico.quantidadeSolicitada} \n`;
          valor += servicoEntity.precoPromocional == 0 ? (servicoEntity.preco / 1000) * servico.quantidadeSolicitada : (servicoEntity.precoPromocional / 1000) * servico.quantidadeSolicitada;
          await this.servicoPedidoRepository.save(servicoPedido);
        }
      }
      await queryRunner.manager.update(Pedido, pedido.id, { valor });
      const configFormaPagamento = await this.configFormaPagamentoRepository.findOne({
        where: {
          status: true,
        }
      })
      const clientePagamento = this.mercadoPagoService.createClient(configFormaPagamento.key)
      let pagamento = {} as any
      if (createPedidoDto.meioPagamento === MeioPagamento.PIX) {
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
          idConfigFormaPagamento: configFormaPagamento,
          valor: valor,
          idPedido: pedido
        });
        await this.transacaoRepository.save(transacao);
        const historico = await queryRunner.manager.create(HistoricoTransacao, {
          idTransacao: transacao.idTransacao,
          data: new Date(),
          status: StatusPagamento.PENDENTE,
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
      } else if (createPedidoDto.meioPagamento === MeioPagamento.CARTAO) {
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
          idConfigFormaPagamento: configFormaPagamento,
          valor: valor,
          idPedido: pedido
        });
        await this.transacaoRepository.save(transacao);
        const historico = await queryRunner.manager.create(HistoricoTransacao, {
          idTransacao: transacao.idTransacao,
          data: new Date(),
          status: StatusPagamento.PENDENTE,
          idPedido: transacao.idPedido
        })
        await queryRunner.manager.save(historico);
        await queryRunner.commitTransaction();
        return pagamento;
      } else {
        throw new HttpException('Forma de pagamento inválida, formas de pagamento suportadas: ' + MeioPagamento, 404);
      }
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
      const pedidos = await this.pedidoRepository.find(
        {
          relations: {
            idCliente: true,
            historicoTransacao: true,
            servicoPedidos: true,
          }
        });
      return pedidos
    } catch (error) {
      console.log(error);
      throw new HttpException(error, 500);
    }
  }

  findOne(id: number) {
    try {
      return this.pedidoRepository.findOne({ where: { id }, relations: { idCliente: true, historicoTransacao: true } });
    } catch (error) {
      throw new HttpException(error, 500);
    }
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
      await queryRunner.commitTransaction();
      return formaPagamento;
    } catch (error) {
      console.log(error);
      await queryRunner.rollbackTransaction();
      throw new HttpException(error, 500);
    } finally {
      await queryRunner.release();
    }
  }
  async findAllFormaPagamento() {
    return await this.formaPagamentoRepository.find();
  }


  async updateFormaPagamento(id: number, updateFormaPagamento: CreateFormaPagamentoDto) {
    const queryRunner = this.dataSource.createQueryRunner();
    try {
      await queryRunner.connect();
      await queryRunner.startTransaction();
      const formaPagamento = await this.formaPagamentoRepository.findOne({ where: { id } });
      if (!formaPagamento) {
        throw new HttpException('Forma de pagamento não encontrada', 404);
      }
      await this.formaPagamentoRepository.update({ id }, {
        descricao: updateFormaPagamento.descricao,
        status: true,
      });
      await queryRunner.commitTransaction();
      return await this.formaPagamentoRepository.findOne({ where: { id } });
    } catch (error) {
      console.log(error);
      await queryRunner.rollbackTransaction();
      throw new HttpException(error, 500);
    } finally {
      await queryRunner.release();
    }
  }

  async createConfigPagamento(createConfigPagamento: CreateConfigPagamentoDto) {
    const queryRunner = this.dataSource.createQueryRunner();
    try {
      await queryRunner.connect();
      await queryRunner.startTransaction();
      const configPagamentoAtivo = await this.configFormaPagamentoRepository.findOne({ where: { status: true } });
      if (configPagamentoAtivo) {
        await this.configFormaPagamentoRepository.update({ id: configPagamentoAtivo.id }, {
          status: false,
        })
      }
      const configPagamento = this.configFormaPagamentoRepository.create({
        ...createConfigPagamento,
        status: true
      });
      await this.configFormaPagamentoRepository.save(configPagamento);
      await queryRunner.commitTransaction();
      return configPagamento;
    } catch (error) {
      console.error(error);
      throw new HttpException(error, 500);
    } finally {
      await queryRunner.release();
    }
  }

  async updateConfigPagamento(id: number, updateConfigPagamento: UpdateConfigPagamentoDto) {
    const queryRunner = this.dataSource.createQueryRunner();
    try {
      await queryRunner.connect();
      await queryRunner.startTransaction();
      const configPagamento = await this.configFormaPagamentoRepository.findOne({ where: { id } });
      if (!configPagamento) {
        throw new HttpException('Configuração de forma de pagamento não encontrada', 404);
      }
      await this.configFormaPagamentoRepository.update({ id }, {
        status: updateConfigPagamento.status,
        key: updateConfigPagamento.key,
        nome: updateConfigPagamento.nome
      });
      await queryRunner.commitTransaction();
      return await this.configFormaPagamentoRepository.findOne({ where: { id } });
    } catch (error) {
      console.error(error);
      await queryRunner.rollbackTransaction();
      throw new HttpException(error, 500);
    } finally {
      await queryRunner.release();
    }
  }

  async findAllConfigPagamento() {
    try {
      return await this.configFormaPagamentoRepository.find();
    } catch (error) {
      console.error(error);
      throw new HttpException(error, 500);
    }
  }
}

