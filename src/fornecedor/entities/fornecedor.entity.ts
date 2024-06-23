import { ServicoSeguimentado } from "src/servico-seguimentado/entities/servico-seguimentado.entity";
import { Servico } from "src/servico/entities/servico.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'fornecedores' })
export class Fornecedor {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    nome: string;

    @Column()
    url: string;

    @Column()
    key: string;

    @Column()
    saldo: number;

    @Column()
    moeda: string;

    @Column()
    cadastro: Date;

    @Column()
    status: string;

    @OneToMany(() => Servico, servico => servico.idFornecedor)
    servicos: Servico[];

    @OneToMany(() => ServicoSeguimentado, servico => servico.idFornecedor)
    servicosSeguimentados: ServicoSeguimentado[];
}
