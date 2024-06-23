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

    @Column()
    cor: string;

    @Column()
    icon: string;

    @Column()
    logo: string;

    @Column()
    status: string;

    @CreateDateColumn()
    dataCriacao: Date;
}
