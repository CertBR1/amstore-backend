import { Column, Entity, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm"
import { ConfigFormaPagamento } from "./config-forma-pagamento.entity";
import { Transacao } from "src/transacao/entities/transacao.entity";

@Entity({ name: 'FormaPagamento' })
export class FormaPagamento {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    descricao: string

    @Column()
    status: boolean

    @OneToOne(() => ConfigFormaPagamento, configuracao => configuracao.formaPagamento, { nullable: true })
    configuracao: ConfigFormaPagamento;

    @OneToMany(() => Transacao, transacao => transacao.idFormaPagamento)
    transacoes: Transacao[];
}