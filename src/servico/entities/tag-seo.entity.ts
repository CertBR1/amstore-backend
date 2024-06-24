import { Column, Entity, Index, JoinTable, ManyToMany, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";
import { Servico } from "./servico.entity";

@Entity('tagSeo')
export class TagSeo {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    @Index({ unique: false })
    nome: string;

    @ManyToMany(() => Servico, servico => servico.tagSeo)
    @JoinTable()
    servicos: Servico[];
}