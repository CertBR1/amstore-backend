import { Servico } from "src/servico/entities/servico.entity";
import { Subcategoria } from "src/subcategoria/entities/subcategoria.entity";
import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'categorias' })
export class Categoria {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    nome: string;

    @Column()
    imagemUrl: string;

    @CreateDateColumn()
    dataCriacao: Date;

    @Column()
    status: boolean;

    @OneToMany(() => Servico, servico => servico.idCategoria)
    servicos: Servico[];

    @OneToMany(() => Subcategoria, subcategoria => subcategoria.idCategoria)
    subcategorias: Subcategoria[];
}
