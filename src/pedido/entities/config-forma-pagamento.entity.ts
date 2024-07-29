import { BeforeInsert, BeforeUpdate, Column, Entity, getRepository, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn, Repository } from "typeorm";
import { FormaPagamento } from "./forma-pagamento";
import { InjectRepository } from "@nestjs/typeorm";
import { Transacao } from "src/transacao/entities/transacao.entity";

@Entity({ name: 'ConfigFormaPagamento' })
export class ConfigFormaPagamento {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    nome: string;

    @Column()
    key: string;

    @Column()
    status: boolean;


    @OneToMany(() => Transacao, transacao => transacao.idConfigFormaPagamento)
    transacoes: Transacao[];
}