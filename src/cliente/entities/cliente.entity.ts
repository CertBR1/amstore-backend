import { Pedido } from "src/pedido/entities/pedido.entity";
import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'clientes' })
export class Cliente {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    nome: string;

    @Column()
    whatsapp: string;

    @Column()
    email: string;

    @CreateDateColumn()
    dataCriacao: Date;

    @Column()
    dataUltimaCompra: Date;

    @Column()
    status: string;

    @OneToMany(() => Pedido, pedido => pedido.idCliente)
    pedidos: Pedido[];
}
