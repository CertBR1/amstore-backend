import { Categoria } from "src/categoria/entities/categoria.entity";
import { Servico } from "src/servico/entities/servico.entity";
import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'subcategorias' })
export class Subcategoria {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    descricao: string;

    @CreateDateColumn()
    dataCriacao: Date;

    @Column()
    status: boolean;

    @ManyToOne(() => Categoria, categoria => categoria.subcategorias)
    idCategoria: Categoria;

    @OneToMany(() => Servico, servico => servico.idSubcategoria)
    servicos: Servico[];
}
