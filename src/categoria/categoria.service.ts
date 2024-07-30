import { HttpException, Injectable } from '@nestjs/common';
import { CreateCategoriaDto } from './dto/create-categoria.dto';
import { UpdateCategoriaDto } from './dto/update-categoria.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Categoria } from './entities/categoria.entity';

@Injectable()
export class CategoriaService {
  constructor(
    @InjectRepository(Categoria)
    private categoriaRepository: Repository<Categoria>,
    private dataSource: DataSource
  ) { }
  async create(createCategoriaDto: CreateCategoriaDto) {
    const queryRunner = this.dataSource.createQueryRunner();
    try {
      await queryRunner.connect();
      await queryRunner.startTransaction();
      const categoria = this.categoriaRepository.create(
        {
          nome: createCategoriaDto.nome,
          status: true,
          imagemUrl: createCategoriaDto.imagemUrl,
          bannerUrl: createCategoriaDto.bannerUrl,
          dataCriacao: new Date(),
        }
      );
      await queryRunner.manager.save(categoria);
      await queryRunner.commitTransaction();
      return categoria;
    } catch (error) {
      console.log(error);
      await queryRunner.rollbackTransaction();
      throw new HttpException(error, 500);
    } finally {
      await queryRunner.release();
    }
  }

  async findAll() {
    try {
      return await this.categoriaRepository.find({
        relations: { subcategorias: true }
      });
    } catch (error) {
      console.log(error);
      throw new HttpException(error, 500);
    }
  }

  async findOne(id: number) {
    try {
      return await this.categoriaRepository.findOne({ where: { id }, relations: { subcategorias: true, servicos: true } });
    } catch (error) {
      console.log(error);
      throw new HttpException(error, 500);
    }
  }

  async update(id: number, updateCategoriaDto: UpdateCategoriaDto) {
    const queryRunner = this.dataSource.createQueryRunner();
    try {
      await queryRunner.connect();
      await queryRunner.startTransaction();
      const categoria = await this.categoriaRepository.findOneBy({ id });
      if (!categoria) {
        throw new HttpException('Categoria não encontrada', 404);
      }
      await queryRunner.manager.update(Categoria, id, {
        nome: updateCategoriaDto.nome,
        status: updateCategoriaDto.status,
        imagemUrl: updateCategoriaDto.imagemUrl,
      });
      await queryRunner.commitTransaction();
      return await this.categoriaRepository.findOneBy({ id });
    } catch (error) {
      console.log(error);
      await queryRunner.rollbackTransaction();
      throw new HttpException(error, 500);

    } finally {
      await queryRunner.release();
    }
  }

  async remove(id: number) {
    const queryRunner = this.dataSource.createQueryRunner();
    try {
      await queryRunner.connect();
      await queryRunner.startTransaction();
      const categoria = await this.categoriaRepository.findOneBy({ id });
      if (!categoria) {
        throw new HttpException('Categoria não encontrada', 404);
      }
      await queryRunner.manager.delete(Categoria, id);
      await queryRunner.commitTransaction();
      return {
        message: 'Categoria deletada com sucesso',
        nome: categoria.nome
      }
    } catch (error) {
      console.log(error);
      await queryRunner.rollbackTransaction();
      throw new HttpException(error, 500);
    } finally {
      await queryRunner.release();
    }
  }
}
