import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { FormaPagamento } from "./forma-pagamento";

@Entity({ name: 'ConfigFormaPagamento' })
export class ConfigFormaPagamento {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    nome: string;

    @Column()
    key: string;

    @Column({ nullable: true })
    metodoPagamento: string;

    @OneToOne(() => FormaPagamento, formaPagamento => formaPagamento.configuracao)
    @JoinColumn()
    formaPagamento: FormaPagamento;
}