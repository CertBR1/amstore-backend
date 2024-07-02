import { FormaPagamento } from "src/pedido/entities/forma-pagamento";
import { Pedido } from "src/pedido/entities/pedido.entity";
import { ServicoPedido } from "src/servico-pedido/entities/servico-pedido.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'transacoes' })
export class Transacao {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar' })
    idTransacao: string;

    @OneToOne(() => ServicoPedido, pedido => pedido.idTransacao, { nullable: true, eager: false })
    @JoinColumn()
    idPedido: ServicoPedido;

    @Column({ type: 'float' })
    valor: number;

    @Column({ nullable: true })
    dataSolicitacao: Date;

    @Column({ nullable: true })
    dataStatus: Date;

    @Column({ nullable: true })
    dataAprovacao: Date;

    @ManyToOne(() => FormaPagamento, formaPagamento => formaPagamento.transacoes)
    idFormaPagamento: FormaPagamento;
}
