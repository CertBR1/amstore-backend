import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: "ConfigSistema" })
export class ConfigSistema {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    nomeLoja: string;

    @Column({ nullable: true })
    urlWhatsapp: string;

    @Column({ nullable: true })
    keyWhatsapp: string;

    @Column({ nullable: true })
    urlVideo: string;

    @Column({ nullable: true })
    cor: string;

    @Column({ nullable: true })
    icon: string;

    @Column({ nullable: true })
    logo: string;

    @Column({ nullable: true })
    whatsappSuporte: string;

    @Column({ nullable: true })
    whatsappVendas: string;

    @Column({ nullable: true })
    logoBranca: string;

    @Column()
    status: boolean;

    @CreateDateColumn()
    dataCriacao: Date;
}
