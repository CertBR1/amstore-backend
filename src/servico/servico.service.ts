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
import { ServicoSeguimentado } from 'src/servico-seguimentado/entities/servico-seguimentado.entity';

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
    @InjectRepository(ServicoSeguimentado)
    private servicoSeguimentadoRepository: Repository<ServicoSeguimentado>,
    private dataSource: DataSource
  ) { }
  async create(createServicoDto: CreateServicoDto) {
    const queryRunner = this.dataSource.createQueryRunner();
    console.log('CREATE SERVICO', createServicoDto)
    try {
      await queryRunner.connect();
      await queryRunner.startTransaction();
      let tags = undefined;
      if (createServicoDto.tagSeo && createServicoDto.tagSeo.length > 0) {
        tags = await this.createTagSeo(createServicoDto.tagSeo);
      }
      const idFornecedor = await this.fornecedorRepository.findOneBy({ id: createServicoDto.idFornecedor });
      const idCategoria = await this.categoriaRepository.findOneBy({ id: createServicoDto.idCategoria });
      const idSubcategoria = await this.subcategoriaRepository.findOneBy({ id: createServicoDto.idSubcategoria });
      if (!idFornecedor || !idCategoria || !idSubcategoria) {
        throw new HttpException('Fornecedores, Categorias ou Subcategorias inexistentes', 400);
      }
      const servico = this.servicoRepository.create({
        tagSeo: tags,
        idFornecedor,
        idCategoria,
        idSubcategoria,
        idServicoFornecedor: createServicoDto.idServicoFornecedor,
        descricao: createServicoDto.descricao,
        multiplo: createServicoDto.multiplo,
        max: createServicoDto.max,
        min: createServicoDto.min,
        nome: createServicoDto.nome,
        preco: createServicoDto.preco,
        precoPromocional: createServicoDto.precoPromocional,
        reposicao: createServicoDto.reposicao,
        status: true,
        tipo: createServicoDto.tipo
      });
      if (createServicoDto.infoPrincipais) {
        createServicoDto.infoPrincipais.idServico = servico.id;
        const info = await this.createInfoPrincipais(createServicoDto.infoPrincipais);
        servico.informacoesPrincipais = [info];
      }
      await queryRunner.manager.save(servico);
      if (createServicoDto.infoAdicionais.length > 0) {
        createServicoDto.infoAdicionais.forEach(async (element) => {
          console.log(element);
          element.idServico = servico.id;
          const info = await this.createInfoAdicionais(element);
          servico.informacoesAdicionais = [info];
        });
      }
      await queryRunner.manager.save(servico);
      await queryRunner.commitTransaction();
      return await this.servicoRepository.findOne({
        where: { id: servico.id }, relations: [
          'idFornecedor',
          'idCategoria',
          'idSubcategoria',
          'servicosSeguimentados.idSeguimento',
          'servicosSeguimentados.idTipoSeguimento',
          'servicosSeguimentados.idFornecedor',
          'informacoesAdicionais',
          'informacoesPrincipais',
          'tagSeo'
        ]
      });
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
      return this.servicoRepository.find({
        relations: {
          idFornecedor: true,
          idCategoria: true,
          idSubcategoria: true,
          servicosSeguimentados: true,
          informacoesAdicionais: true,
          informacoesPrincipais: true,
          tagSeo: true
        }
      });
    } catch (error) {
      console.log(error);
      throw new HttpException(error, 500);
    }
  }

  async findOne(id: number) {
    try {
      const servico = await this.servicoRepository.findOne({
        where: { id },
        relations: [
          'idFornecedor',
          'idCategoria',
          'idSubcategoria',
          'servicosSeguimentados.idSeguimento',
          'servicosSeguimentados.idTipoSeguimento',
          'servicosSeguimentados.idFornecedor',
          'informacoesAdicionais',
          'informacoesPrincipais',
          'tagSeo'
        ]
      })
      console.log('servico encontrado: =>', servico)
      // const servicoSeguimentado = await this.servicoSeguimentadoRepository.find({
      //   where: { idServico: servico },
      //   relations: {
      //     idSeguimento: true,
      //     idTipoSeguimento: true,
      //     idFornecedor: true,
      //     idServico: true
      //   }
      // })
      // console.log('servicoSeguimentadoEncontrado: =>', servicoSeguimentado)
      // servico.servicosSeguimentados = servicoSeguimentado
      return servico
    } catch (error) {
      console.log(error);
      throw new HttpException(error, 500);
    }
  }

  async update(id: number, updateServicoDto: UpdateServicoDto) {
    const queryRunner = this.dataSource.createQueryRunner();
    console.log('UPDATE SERVICO', updateServicoDto)
    const { idCategoria, idFornecedor, idSubcategoria } = updateServicoDto
    console.log('UPDATE SERVICO', idCategoria)
    try {
      await queryRunner.connect();
      await queryRunner.startTransaction();
      const servico = await this.servicoRepository.findOneBy({ id });
      if (!servico) {
        throw new HttpException('Servico inexistente', 400);
      }
      let idCategoriaEntity = undefined;
      if (idCategoria) {
        idCategoriaEntity = await this.categoriaRepository.findOne({ where: { id: idCategoria } });
        if (!idCategoriaEntity) {
          throw new HttpException('Categorias inexistentes', 400);
        }
      }
      let idFornecedorEntity = undefined;
      if (idFornecedor) {
        idFornecedorEntity = await this.fornecedorRepository.findOne({ where: { id: idFornecedor } });
        if (!idFornecedorEntity) {
          throw new HttpException('Fornecedores inexistentes', 400);
        }
      }
      let idSubcategoriaEntity = undefined;
      if (idSubcategoria) {
        idSubcategoriaEntity = await this.subcategoriaRepository.findOne({ where: { id: idSubcategoria } });
        if (!idSubcategoriaEntity) {
          throw new HttpException('Subcategorias inexistentes', 400);
        }
      }
      const retonro = await this.servicoRepository.update({ id }, {
        idFornecedor: idFornecedorEntity || servico.idFornecedor,
        idCategoria: idCategoriaEntity || servico.idCategoria,
        idSubcategoria: idSubcategoriaEntity || servico.idSubcategoria,
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
        tipo: updateServicoDto.tipo
      });
      console.log('UPDATE SERVICO', retonro)
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
    console.log('createServicoDto', createServicoDto)
    const queryRunner = this.dataSource.createQueryRunner();
    try {
      await queryRunner.connect();
      await queryRunner.startTransaction();
      const servico = await this.servicoRepository.findOneBy({ id: createServicoDto.idServico })
      if (!servico) {
        throw new HttpException('Servico inexistente', 400);
      }
      const info = this.infoServicoAdcionaisRepository.create({
        descricao: createServicoDto.descricao,
        pergunta: createServicoDto.pergunta,
        resposta: createServicoDto.resposta,
        idServico: servico
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
        idServico: await this.servicoRepository.findOneBy({ id: createInfoPrincipal.idServico }),
        inicioEnvio: createInfoPrincipal.inicioEnvio,
        qualidade: createInfoPrincipal.qualidade,
        velocidade: createInfoPrincipal.velocidade,
        descricaoQualidade: createInfoPrincipal.descricaoQualidade,
        descricaoVelocidade: createInfoPrincipal.descricaoVelocidade,
        descricaoInicioEnvio: createInfoPrincipal.descricaoInicioEnvio
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
