
import { Cliente } from "src/cliente/entities/cliente.entity";
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'pedidos' })
export class Pedido {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    valor: number;

    @CreateDateColumn()
    data: Date;

    @Column()
    statusPagamento: string;

    @Column()
    statusPedido: string;

    @Column()
    origem: string;

    @ManyToOne(() => Cliente, cliente => cliente.pedidos)
    idCliente: Cliente;
}
