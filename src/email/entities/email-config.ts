import { BeforeInsert, BeforeUpdate, Column, Entity, getRepository, PrimaryGeneratedColumn } from "typeorm";

@Entity('email_config')
export class EmailConfig {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    host: string;

    @Column()
    port: number;

    @Column()
    username: string;

    @Column()
    password: string;

    @Column()
    from: string;

    @Column()
    template: string;

    @Column()
    status: boolean;

}