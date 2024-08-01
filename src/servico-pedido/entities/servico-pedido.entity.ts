import { Pedido } from "src/pedido/entities/pedido.entity";
import { ServicoSeguimentado } from "src/servico-seguimentado/entities/servico-seguimentado.entity";
import { Servico } from "src/servico/entities/servico.entity";
import { Transacao } from "src/transacao/entities/transacao.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: "SevicoPedido" })
export class ServicoPedido {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Servico)
    @JoinColumn({ name: 'idServico' })
    idServico: Servico

    @ManyToOne(() => ServicoSeguimentado)
    @JoinColumn({ name: 'idSeguimento', })
    idSeguimento?: ServicoSeguimentado

    @ManyToOne(() => Pedido)
    @JoinColumn({ name: 'idPedido' })
    idPedido: Pedido;

    @Column({ nullable: true })
    custo: string

    @Column()
    link: string;

    @Column({ nullable: true })
    quantidadeInicial: number;

    @Column({ nullable: true, type: 'float' })
    valorServico: number

    @Column()
    quantidadeSolicitada: number;

    @Column({ nullable: true })
    numeroOrdem: string;

    @Column({ nullable: true })
    quantidadeEntregue: number;

    @OneToOne(() => Transacao, transacao => transacao.idPedido, { nullable: true, eager: false })
    idTransacao: Transacao;

    @Column({ nullable: true })
    status: string

    @Column({ nullable: true })
    dataConclusao: Date

    @Column({ nullable: true })
    comentarios?: string

    @Column({ nullable: true })
    quantidadeRestante: string;
}
