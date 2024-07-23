import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Servico } from "./servico.entity";

@Entity({ name: 'infoServicoAdcionais' })
export class InfoServicoAdcionais {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    pergunta: string;

    @Column()
    resposta: string;

    @Column()
    descricao: string;

    @ManyToOne(() => Servico, (servico) => servico.informacoesAdicionais)
    idServico: Servico
}