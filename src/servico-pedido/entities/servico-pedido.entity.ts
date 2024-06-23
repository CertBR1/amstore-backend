import { Pedido } from "src/pedido/entities/pedido.entity";
import { Servico } from "src/servico/entities/servico.entity";
import { Transacao } from "src/transacao/entities/transacao.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: "SevicoPedido" })
export class ServicoPedido {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Servico)
    @JoinColumn({ name: 'idServico' })
    idServico: Servico;

    @ManyToOne(() => Pedido)
    @JoinColumn({ name: 'idPedido' })
    idPedido: Pedido;

    @Column()
    link: string;

    @Column()
    quantidadeSolicitada: number;

    @Column()
    quantidadeEntregue: number;

    @Column()
    numeroOrdem: number;

    @OneToOne(() => Transacao, transacao => transacao.idPedido, { nullable: true, eager: false })
    idTransacao: Transacao;
}
