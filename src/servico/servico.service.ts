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
    console.log('CREATE SERVICO PAARA CADASTRO: ', createServicoDto)
    console.log('CREATE SERVIÇO ID SUBCATEGORIA: ', createServicoDto.idSubCategoria)
    try {
      await queryRunner.connect();
      await queryRunner.startTransaction();
      let tags = undefined;
      if (createServicoDto.tagSeo && createServicoDto.tagSeo.length > 0) {
        tags = await this.createTagSeo(createServicoDto.tagSeo);
      }
      const idFornecedor = await this.fornecedorRepository.findOneBy({ id: createServicoDto.idFornecedor });
      const idCategoria = await this.categoriaRepository.findOneBy({ id: createServicoDto.idCategoria });
      const idSubcategoria = await this.subcategoriaRepository.findOneBy({ id: createServicoDto.idSubCategoria });
      if (!idFornecedor) {
        throw new HttpException('Fornecedor inexistente', 400);
      }
      if (!idCategoria) {
        throw new HttpException('Categoria inexistente', 400);
      }
      if (!idSubcategoria) {
        throw new HttpException('Subcategoria inexistente', 400);
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
        promocional: createServicoDto.promocional,
        status: true,
        tipo: createServicoDto.tipo
      });
      await queryRunner.manager.save(servico);
      if (createServicoDto.infoPrincipais) {
        createServicoDto.infoPrincipais.idServico = servico.id;
        const info = await this.createInfoPrincipais(createServicoDto.infoPrincipais);
        servico.informacoesPrincipais = [info];
      }
      await queryRunner.manager.save(servico);
      if (createServicoDto.infoAdicionais && createServicoDto.infoAdicionais.length > 0) {
        createServicoDto.infoAdicionais.forEach(async (element) => {
          console.log('INFO ADICIONAIS: ', element)
          element.idServico = servico.id;
          const info = await this.createInfoAdicionais(element);
          servico.informacoesAdicionais = [info];
        });
      }
      await queryRunner.manager.save(servico);
      await queryRunner.commitTransaction();
      const servicoCriado = await this.servicoRepository.findOne({
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
      console.log('SERVICO CRIADO: ', servicoCriado)
      return servicoCriado;
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
      });
      if (!servico) {
        throw new HttpException('Servico não encontrado', 404);
      }
      return servico
    } catch (error) {
      console.log(error);
      throw new HttpException(error, 500);
    }
  }

  async update(id: number, updateServicoDto: UpdateServicoDto) {
    const queryRunner = this.dataSource.createQueryRunner();
    const { idCategoria, idFornecedor, idSubCategoria } = updateServicoDto
    console.log('UPDATE: ', updateServicoDto)
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
      if (idSubCategoria) {
        idSubcategoriaEntity = await this.subcategoriaRepository.findOne({ where: { id: idSubCategoria } });
        if (!idSubcategoriaEntity) {
          throw new HttpException('Subcategorias inexistentes', 400);
        }
      }
      if (updateServicoDto.infoAdicionais && updateServicoDto.infoAdicionais.length > 0) {
        for (let i = 0; i < updateServicoDto.infoAdicionais.length; i++) {
          const item = updateServicoDto.infoAdicionais[i];
          const itemEntity = await this.infoServicoAdcionaisRepository.update({ id: item.id }, {
            pergunta: item.pergunta,
            resposta: item.resposta,
            descricao: item.descricao
          });
          await queryRunner.manager.save(itemEntity);
        }
      }
      if (updateServicoDto.infoPrincipais) {
        const itemEntity = await this.infoServicoPrincipaisRepository.update({ id: updateServicoDto.infoPrincipais.id }, {
          qualidade: updateServicoDto.infoPrincipais.qualidade,
          velocidade: updateServicoDto.infoPrincipais.velocidade,
          inicioEnvio: updateServicoDto.infoPrincipais.inicioEnvio,
          descricaoInicioEnvio: updateServicoDto.infoPrincipais.descricaoInicioEnvio,
          descricaoQualidade: updateServicoDto.infoPrincipais.descricaoQualidade,
          descricaoVelocidade: updateServicoDto.infoPrincipais.descricaoVelocidade
        })
        await queryRunner.manager.save(itemEntity);
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
        tipo: updateServicoDto.tipo,
        promocional: updateServicoDto.promocional || servico.promocional
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
    try {
      const retonro = this.servicoRepository.softDelete({ id });
      return {
        message: 'Servico removido com sucesso',
        retonro
      }
    } catch (error) {
      console.log(error);
      throw new HttpException(error, 500);
    }
  }

  async createInfoAdicionais(createServicoDto: CreateInfoServicoAdcionaisDto) {
    console.log('create info adicionais', createServicoDto)
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

  async removeInfoAdicionais(id: number) {
    try {
      const retorno = await this.infoServicoAdcionaisRepository.softDelete({ id });
      return {
        message: 'Info adicionais removido com sucesso',
        retorno
      }
    } catch (error) {
      console.log(error);
      throw new HttpException(error, 500);
    }
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
