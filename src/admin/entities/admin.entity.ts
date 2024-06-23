import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: "adminCred" })
export class AdminCred {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    nome: string;

    @Column({ unique: true })
    usuario: string;

    @Column()
    senha: string;
}
