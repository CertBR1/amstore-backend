import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Seguimento } from "./seguimento.entity";
import { ServicoSeguimentado } from "src/servico-seguimentado/entities/servico-seguimentado.entity";

@Entity({ name: 'tipoSeguimentos' })
export class TipoSeguimento {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    nome: string;

    @ManyToOne(() => Seguimento, seguimento => seguimento.tiposSeguimento)
    @JoinColumn({ name: 'idSeguimento' })
    idSeguimento: Seguimento;

    @OneToMany(() => ServicoSeguimentado, servicoSeguimentado => servicoSeguimentado.idTipoSeguimento)
    servicosSeguimentados: ServicoSeguimentado[];
}