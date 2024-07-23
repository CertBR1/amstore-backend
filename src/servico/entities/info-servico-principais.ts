import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Servico } from "./servico.entity";

@Entity({ name: 'infoServicoPrincipais' })
export class InfoServicoPrincipais {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Servico, servico => servico.informacoesPrincipais)
    idServico: Servico

    @Column()
    inicioEnvio: string;

    @Column({ nullable: true })
    descricaoInicioEnvio: string;

    @Column()
    qualidade: string;

    @Column({ nullable: true })
    descricaoQualidade: string;

    @Column()
    velocidade: string;

    @Column({ nullable: true })
    descricaoVelocidade: string;
}