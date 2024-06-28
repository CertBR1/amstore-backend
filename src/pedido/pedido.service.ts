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
    @InjectRepository(Cliente)
    private readonly clienteRepository: Repository<Cliente>,
    private readonly axiosClient: AxiosClientService,
    private readonly mercadoPagoService: MercadoPagoService,
    private dataSource: DataSource
  ) { }
  async create(createPedidoDto: CreatePedidoDto) {
    const queryRunner = this.dataSource.createQueryRunner();
    try {
      await queryRunner.connect();
      await queryRunner.startTransaction();
      let valor = 0;
      let cliente = await this.clienteRepository.findOne({
        where: {
          whatsapp: createPedidoDto.cliente.whatsapp
        }
      });
      if (!cliente) {
        const novoCliente = this.clienteRepository.create({
          ...createPedidoDto.cliente,
          status: 'Ativo',
          dataUltimaCompra: new Date(),
          dataCriacao: new Date()
        });
        cliente = await this.clienteRepository.save(novoCliente);
      }
      console.log(cliente)
      const pedido = this.pedidoRepository.create(
        {
          data: new Date(),
          statusPedido: 'Pendente',
          statusPagamento: 'Pendente',
          valor: 0,
          idCliente: cliente,
          origem: createPedidoDto.origem || 'SITE'
        }
      );
      for (const servico of createPedidoDto.servicos) {
        const servicoEntity = await this.servicoRepository.findOne({
          where: {
            id: servico.idServico
          },
          relations: {
            idFornecedor: true
          }
        });
        if (!servicoEntity) {
          throw new HttpException(`Serviço não ${servico.idServico} encontrado`, 404);
        }
        await this.pedidoRepository.save(pedido);
        const servicoPedido = this.servicoPedidoRepository.create({
          idPedido: pedido,
          idServico: servicoEntity,
          link: createPedidoDto.link,
          quantidadeSolicitada: servico.quantidadeSolicitada,
        });
        valor += servicoEntity.preco;
        await this.servicoPedidoRepository.save(servicoPedido);
      }
      await queryRunner.manager.update(Pedido, pedido.id, { valor });
      const formaPagamento = await this.formaPagamentoRepository.findOne({
        where: {
          id: createPedidoDto.idFormaPagamento
        }, relations: {
          configuracao: true
        }
      })
      const clientePagamento = this.mercadoPagoService.createClient(formaPagamento.configuracao.key)
      const pagamento = await this.mercadoPagoService.criarPagamento(
        clientePagamento,
        {
          transaction_amount: valor,
          description: 'implementar a descricao do pedido aqui',
          payment_method_id: 'pix',
          notification_url: 'https://webhook.site/6ff3b1d1-3f97-4297-90ed-3db38536c40f',
          payer: {
            email: cliente.email,
          },
        },
      )
      return {
        id: pedido.id,
        cliente: cliente,
        valor: pagamento.transaction_amount,
        qrCodeBase64: pagamento.point_of_interaction.transaction_data.qr_code_base64,
        qrCode: pagamento.point_of_interaction.transaction_data.qr_code,
      };
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
          idCliente: true
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
}

