import { FormaPagamento } from "src/pedido/entities/forma-pagamento";
import { Pedido } from "src/pedido/entities/pedido.entity";
import { ServicoPedido } from "src/servico-pedido/entities/servico-pedido.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'transacoes' })
export class Transacao {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    idTransacao: string;

    @OneToOne(() => ServicoPedido, pedido => pedido.idTransacao, { nullable: true, eager: false })
    @JoinColumn()
    idPedido: ServicoPedido;

    @Column()
    valor: number;

    @Column()
    dataSolicitacao: Date;

    @Column()
    dataStatus: Date;

    @Column()
    dataAprovacao: Date;

    @ManyToOne(() => FormaPagamento, formaPagamento => formaPagamento.transacoes)
    idFormaPagamento: FormaPagamento;
}
