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
import { CreateInfoServicoAdcionaisDto } from './dto/create-info-servico-adcionais';

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
      if (createServicoDto.infoPrincipais) {
        createServicoDto.infoPrincipais.idServico = servico.id;
        await this.createInfoPrincipais(createServicoDto.infoPrincipais);
      }
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
    try {
      return this.servicoRepository.find({ relations: { idFornecedor: true, idCategoria: true, idSubcategoria: true, tagSeo: true } });
    } catch (error) {
      console.log(error);
      throw new HttpException(error, 500);
    }
  }

  findOne(id: number) {
    try {
      return this.servicoRepository.findOne({ where: { id }, relations: { idFornecedor: true, idCategoria: true, idSubcategoria: true, tagSeo: true } });
    } catch (error) {
      console.log(error);
      throw new HttpException(error, 500);
    }
  }

  async update(id: number, updateServicoDto: UpdateServicoDto) {
    const queryRunner = this.dataSource.createQueryRunner();
    try {
      await queryRunner.connect();
      await queryRunner.startTransaction();
      await queryRunner.manager.update(Servico, id, {
        idServicoFornecedor: updateServicoDto.idServicoFornecedor,
        descricao: updateServicoDto.descricao,
        multiplo: updateServicoDto.multiplo,
        max: updateServicoDto.max,
        min: updateServicoDto.min,
        nome: updateServicoDto.nome,
        preco: updateServicoDto.preco,
        precoPromocional: updateServicoDto.precoPromocional,
        reposicao: updateServicoDto.reposicao,
        status: updateServicoDto.status,
        tipo: updateServicoDto.tipo,
        idFornecedor: await this.fornecedorRepository.findOneBy({ id: updateServicoDto.idFornecedor }),
        idCategoria: await this.categoriaRepository.findOneBy({ id: updateServicoDto.idCategoria }),
        idSubcategoria: await this.subcategoriaRepository.findOneBy({ id: updateServicoDto.idSubcategoria }),
      });
      await queryRunner.commitTransaction();
      return await this.findOne(id);
    }
    catch (error) {
      console.log(error);
      await queryRunner.rollbackTransaction();
      throw new HttpException(error, 500);
    } finally {
      await queryRunner.release();
    }
  }

  remove(id: number) {
    return `This action removes a #${id} servico`;
  }

  async createInfoAdicionais(createServicoDto: CreateInfoServicoAdcionaisDto) {
    const queryRunner = this.dataSource.createQueryRunner();
    try {
      await queryRunner.connect();
      await queryRunner.startTransaction();
      const info = this.infoServicoAdcionaisRepository.create({
        descricao: createServicoDto.descricao,
        pergunta: createServicoDto.pergunta,
        resposta: createServicoDto.resposta,
        idServico: await this.servicoRepository.findOneBy({ id: createServicoDto.idServico })
      })
      await queryRunner.manager.save(info);
      await queryRunner.commitTransaction();
      return info;
    } catch (error) {
      console.log(error);
      await queryRunner.rollbackTransaction();
      throw new HttpException(error, 500);
    } finally {
      await queryRunner.release();
    }
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
