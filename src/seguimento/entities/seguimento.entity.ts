import { Column, Entity, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { TipoSeguimento } from "./tipo-seguimento.entity";
import { ServicoSeguimentado } from "src/servico-seguimentado/entities/servico-seguimentado.entity";

@Entity({ name: 'seguimento' })
export class Seguimento {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    nome: string;

    @OneToMany(() => TipoSeguimento, tipoSeguimento => tipoSeguimento.idSeguimento)
    tiposSeguimento: TipoSeguimento[];

    @OneToMany(() => ServicoSeguimentado, servicoSeguimentado => servicoSeguimentado.idSeguimento)
    servicosSeguimentados: ServicoSeguimentado[];
}
