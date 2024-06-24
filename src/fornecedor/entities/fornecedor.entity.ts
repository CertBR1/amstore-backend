import { ServicoSeguimentado } from "src/servico-seguimentado/entities/servico-seguimentado.entity";
import { Servico } from "src/servico/entities/servico.entity";
import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'fornecedores' })
export class Fornecedor {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    nome: string;

    @Column()
    url: string;

    @Column({ unique: true })
    key: string;

    @Column()
    saldo: string;

    @Column()
    moeda: string;

    @CreateDateColumn()
    cadastro: Date;

    @Column()
    status: string;

    @OneToMany(() => Servico, servico => servico.idFornecedor)
    servicos: Servico[];

    @OneToMany(() => ServicoSeguimentado, servico => servico.idFornecedor)
    servicosSeguimentados: ServicoSeguimentado[];
}
