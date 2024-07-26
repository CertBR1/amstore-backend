import { Categoria } from "src/categoria/entities/categoria.entity";
import { Fornecedor } from "src/fornecedor/entities/fornecedor.entity";
import { Subcategoria } from "src/subcategoria/entities/subcategoria.entity";
import { Column, DeleteDateColumn, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { InfoServicoPrincipais } from "./info-servico-principais";
import { InfoServicoAdcionais } from "./info-servico-adcionais";
import { ServicoSeguimentado } from "src/servico-seguimentado/entities/servico-seguimentado.entity";
import { TagSeo } from "./tag-seo.entity";
import { Pedido } from "src/pedido/entities/pedido.entity";
import { ServicoPedido } from "src/servico-pedido/entities/servico-pedido.entity";

@Entity({ name: 'servicos' })
export class Servico {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    nome: string;

    @Column()
    descricao: string;

    @ManyToOne(() => Fornecedor, fornecedor => fornecedor.servicos)
    idFornecedor: Fornecedor;

    @ManyToOne(() => Categoria, categoria => categoria.servicos)
    idCategoria: Categoria;

    @ManyToOne(() => Subcategoria, subcategoria => subcategoria.servicos)
    idSubcategoria: Subcategoria;

    @Column()
    idServicoFornecedor: string;

    @Column()
    tipo: string;

    @Column({ type: 'float' })
    preco: number;

    @Column({ type: 'float' })
    precoPromocional: number;

    @Column()
    min: number;

    @Column()
    max: number;

    @Column()
    multiplo: number;

    @Column()
    reposicao: number;

    @Column()
    status: boolean;

    @DeleteDateColumn()
    deletadoEm: Date;

    @OneToMany(() => ServicoPedido, servicoPedido => servicoPedido.idServico)
    servicoPedidos: ServicoPedido[];

    @ManyToMany(() => TagSeo, tag => tag.servicos)
    @JoinTable()
    tagSeo: TagSeo[];

    @OneToMany(() => InfoServicoPrincipais, informacao => informacao.idServico)
    informacoesPrincipais: InfoServicoPrincipais[];

    @OneToMany(() => InfoServicoAdcionais, informacao => informacao.idServico)
    informacoesAdicionais: InfoServicoAdcionais[];

    @OneToMany(() => ServicoSeguimentado, servicoSeguimentado => servicoSeguimentado.idServico)
    servicosSeguimentados: ServicoSeguimentado[];
}
