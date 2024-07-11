import { BeforeInsert, BeforeUpdate, Column, Entity, getRepository, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { FormaPagamento } from "./forma-pagamento";

@Entity({ name: 'ConfigFormaPagamento' })
export class ConfigFormaPagamento {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    nome: string;

    @Column()
    key: string;

    @OneToOne(() => FormaPagamento, formaPagamento => formaPagamento.configuracao)
    @JoinColumn()
    formaPagamento: FormaPagamento;

    @Column()
    status: boolean;

    @BeforeInsert()
    @BeforeUpdate()
    async ensureOnlyOneActive() {
        if (this.status) {
            const activePagamento = await getRepository(ConfigFormaPagamento).findOne({ where: { status: true } });
            if (activePagamento) {
                throw new Error('Já existe um pagamento ativo.');
            }
        }
    }
}