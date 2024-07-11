import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("whastapp_client")
export class WhastappClient {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    whatsappUrl: string;

    @Column()
    whatsappKey: string;

    @Column()
    status: boolean;
}
