import { HttpException, Injectable } from '@nestjs/common';
import { CreateServicoDto } from './dto/create-servico.dto';
import { UpdateServicoDto } from './dto/update-servico.dto';
import { CreateInfoServicoPrincipaisDto } from './dto/create-info-servico-principal';
import { InjectRepository } from '@nestjs/typeorm';
import { InfoServicoPrincipais } from './entities/info-servico-principais';
import { DataSource, Repository } from 'typeorm';
import { InfoServicoAdcionais } from './entities/info-servico-adcionais';
import { Servico } from './entities/servico.entity';
import { Fornecedor } from 'src/fornecedor/entities/fornecedor.entity';
import { Categoria } from 'src/categoria/entities/categoria.entity';
import { Subcategoria } from 'src/subcategoria/entities/subcategoria.entity';
import { TagSeo } from './entities/tag-seo.entity';

@Injectable()
export class ServicoService {
  constructor(
    @InjectRepository(InfoServicoPrincipais)
    private infoServicoPrincipaisRepository: Repository<InfoServicoPrincipais>,
    @InjectRepository(InfoServicoAdcionais)
    private infoServicoAdcionaisRepository: Repository<InfoServicoAdcionais>,
    @InjectRepository(Servico)
    private servicoRepository: Repository<Servico>,
    @InjectRepository(Fornecedor)
    private fornecedorRepository: Repository<Fornecedor>,
    @InjectRepository(Categoria)
    private categoriaRepository: Repository<Categoria>,
    @InjectRepository(Subcategoria)
    private subcategoriaRepository: Repository<Subcategoria>,
    @InjectRepository(TagSeo)
    private tagSeoRepository: Repository<TagSeo>,
    private dataSource: DataSource
  ) { }
  async create(createServicoDto: CreateServicoDto) {
    const queryRunner = this.dataSource.createQueryRunner();
    try {
      await queryRunner.connect();
      await queryRunner.startTransaction();
      const servico = this.servicoRepository.create({
        idFornecedor: await this.fornecedorRepository.findOneBy({ id: createServicoDto.idFornecedor }),
        idCategoria: await this.categoriaRepository.findOneBy({ id: createServicoDto.idCategoria }),
        idSubcategoria: await this.subcategoriaRepository.findOneBy({ id: createServicoDto.idSubcategoria }),
        tagSeo: await this.createTagSeo(createServicoDto.tagSeo),
        idServicoFornecedor: createServicoDto.idServicoFornecedor,
        descricao: createServicoDto.descricao,
        multiplo: createServicoDto.multiplo,
        max: createServicoDto.max,
        min: createServicoDto.min,
        nome: createServicoDto.nome,
        preco: createServicoDto.preco,
        precoPromocional: createServicoDto.precoPromocional,
        reposicao: createServicoDto.reposicao,
        status: createServicoDto.status,
        tipo: createServicoDto.tipo
      });
      await queryRunner.manager.save(servico);
      await queryRunner.commitTransaction();
      return servico;
    } catch (error) {
      console.log(error);
      await queryRunner.rollbackTransaction();
      throw new HttpException(error, 500);
    } finally {
      await queryRunner.release();
    }
  }

  findAll() {
    return `This action returns all servico`;
  }

  findOne(id: number) {
    return `This action returns a #${id} servico`;
  }

  update(id: number, updateServicoDto: UpdateServicoDto) {
    return `This action updates a #${id} servico`;
  }

  remove(id: number) {
    return `This action removes a #${id} servico`;
  }

  createInfoAdicionais(createServicoDto: CreateServicoDto) {
    return 'This action adds a new servico';
  }

  findAllInfoAdicionais() {
    return `This action returns all servico`;
  }

  findOneInfoAdicionais(id: number) {
    return `This action returns a #${id} servico`;
  }

  updateInfoAdicionais(id: number, updateServicoDto: UpdateServicoDto) {
    return `This action updates a #${id} servico`;
  }

  async createInfoPrincipais(createInfoPrincipal: CreateInfoServicoPrincipaisDto) {
    const queryRunner = this.dataSource.createQueryRunner();
    try {
      await queryRunner.connect();
      await queryRunner.startTransaction();
      const servico = this.infoServicoPrincipaisRepository.create({

      });
      await queryRunner.manager.save(servico);
      await queryRunner.commitTransaction();
      return servico;
    } catch (error) {
      console.log(error);
      await queryRunner.rollbackTransaction();
      throw new HttpException(error, 500);
    } finally {
      await queryRunner.release();
    }
  }

  findAllInfoPrincipais() {
    return `This action returns all servico`;
  }

  findOneInfoPrincipais(id: number) {
    return `This action returns a #${id} servico`;
  }

  updateInfoPrincipais(id: number, updateServicoDto: UpdateServicoDto) {
    return `This action updates a #${id} servico`;
  }

  async createTagSeo(arrayTag: string[]) {
    const queryRunner = this.dataSource.createQueryRunner();
    try {
      let tags = [];
      await queryRunner.connect();
      await queryRunner.startTransaction();
      for (let i = 0; i < arrayTag.length; i++) {
        const tagExiste = await this.tagSeoRepository.findOneBy({ nome: arrayTag[i] });
        if (tagExiste) {
          tags.push(tagExiste);
          continue;
        } else {
          const tagSalva = this.tagSeoRepository.create({
            nome: arrayTag[i]
          });
          tags.push(tagSalva);
        }
      }
      await queryRunner.manager.save(tags);
      await queryRunner.commitTransaction();
      return tags;
    } catch (error) {
      console.log(error);
      await queryRunner.rollbackTransaction();
      throw new HttpException(error, 500);
    } finally {
      await queryRunner.release();
    }
  }
}
