import { Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Seguimento } from "./seguimento.entity";
import { ServicoSeguimentado } from "src/servico-seguimentado/entities/servico-seguimentado.entity";

@Entity({ name: 'tipoSeguimentos' })
export class TipoSeguimento {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    nome: string;

    @OneToOne(() => Seguimento, seguimento => seguimento.idTipoSEguimento)
    @JoinColumn()
    seguimento: Seguimento;

    @OneToMany(() => ServicoSeguimentado, servicoSeguimentado => servicoSeguimentado.idTipoSeguimento)
    servicosSeguimentados: ServicoSeguimentado[];
}