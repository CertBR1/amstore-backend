import { Categoria } from "src/categoria/entities/categoria.entity";
import { Fornecedor } from "src/fornecedor/entities/fornecedor.entity";
import { Subcategoria } from "src/subcategoria/entities/subcategoria.entity";
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { InfoServicoPrincipais } from "./info-servico-principais";
import { InfoServicoAdcionais } from "./info-servico-adcionais";
import { ServicoSeguimentado } from "src/servico-seguimentado/entities/servico-seguimentado.entity";

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
    idServicoFornecedor: number;

    @Column()
    tipo: string;

    @Column()
    preco: number;

    @Column()
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
    tagSeo: string;

    @Column()
    status: string;

    @OneToMany(() => InfoServicoPrincipais, informacao => informacao.idServico)
    informacoesPrincipais: InfoServicoPrincipais[];

    @OneToMany(() => InfoServicoAdcionais, informacao => informacao.idServico)
    informacoesAdcionais: InfoServicoAdcionais[];

    @OneToMany(() => ServicoSeguimentado, servicoSeguimentado => servicoSeguimentado.idServico)
    servicosSeguimentados: ServicoSeguimentado[];
}
