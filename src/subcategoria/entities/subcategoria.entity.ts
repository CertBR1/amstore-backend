import { Categoria } from "src/categoria/entities/categoria.entity";
import { Servico } from "src/servico/entities/servico.entity";
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'subcategorias' })
export class Subcategoria {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    descricao: string;

    @Column()
    dataCriacao: Date;

    @Column()
    status: string;

    @ManyToOne(() => Categoria, categoria => categoria.subcategorias)
    idCategoria: Categoria;

    @OneToMany(() => Servico, servico => servico.idSubcategoria)
    servicos: Servico[];
}
