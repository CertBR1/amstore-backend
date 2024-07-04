import { Pedido } from "src/pedido/entities/pedido.entity";
import { Column, CreateDateColumn, Entity, Index, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'clientes' })
export class Cliente {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    nome: string;

    @Index({ unique: true })
    @Column({ unique: true })
    whatsapp: string;

    @Column({ unique: true })
    email: string;

    @CreateDateColumn()
    dataCriacao: Date;

    @Column()
    dataUltimaCompra: Date;

    @Column()
    status: boolean;

    @OneToMany(() => Pedido, pedido => pedido.idCliente)
    pedidos: Pedido[];
}
