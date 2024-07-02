
import { Cliente } from "src/cliente/entities/cliente.entity";
import { HistoricoTransacao } from "src/transacao/entities/historico-transcao.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'pedidos' })
export class Pedido {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'float', nullable: true })
    valor: number;

    @CreateDateColumn()
    data: Date;

    @Column()
    statusPagamento: string;

    @Column()
    statusPedido: string;

    @Column()
    origem: string;

    @ManyToOne(() => Cliente, cliente => cliente.pedidos)
    idCliente: Cliente;

    @OneToOne(() => HistoricoTransacao)
    @JoinColumn()
    historicoTransacao: HistoricoTransacao;
}
