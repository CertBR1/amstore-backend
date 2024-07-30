import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: "ConfigSistema" })
export class ConfigSistema {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    nomeLoja: string;

    @Column()
    urlWhatsapp: string;

    @Column()
    keyWhatsapp: string;

    @Column({ nullable: true })
    urlVideo: string;

    @Column()
    cor: string;

    @Column()
    icon: string;

    @Column()
    logo: string;


    @Column({ nullable: true })
    logoBranca: string;

    @Column()
    status: boolean;

    @CreateDateColumn()
    dataCriacao: Date;
}
