import { Pedido } from "src/pedido/entities/pedido.entity";
import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity('historicoTransacao')
export class HistoricoTransacao {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    idTransacao: string;

    @OneToOne(() => Pedido, pedido => pedido.historicoTransacao)
    idPedido: Pedido;

    @Column()
    data: Date;

    @Column()
    status: string;
}