import { HttpException, Injectable } from '@nestjs/common';
import { CreateSubcategoriaDto } from './dto/create-subcategoria.dto';
import { UpdateSubcategoriaDto } from './dto/update-subcategoria.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Subcategoria } from './entities/subcategoria.entity';
import { DataSource, Repository } from 'typeorm';
import { Categoria } from 'src/categoria/entities/categoria.entity';

@Injectable()
export class SubcategoriaService {
  constructor(
    @InjectRepository(Subcategoria)
    private subcategoriaRepository: Repository<Subcategoria>,
    @InjectRepository(Categoria)
    private categoriaRepository: Repository<Categoria>,
    private dataSource: DataSource
  ) { }
  async create(createSubcategoriaDto: CreateSubcategoriaDto) {
    const queryRunner = this.dataSource.createQueryRunner();
    try {
      await queryRunner.connect();
      await queryRunner.startTransaction();
      const categoria = await this.categoriaRepository.findOneBy({
        id: createSubcategoriaDto.idCategoria
      })
      if (!categoria) {
        throw new HttpException('Categoria não encontrada', 404);
      }
      const subcategoria = this.subcategoriaRepository.create({
        descricao: createSubcategoriaDto.descricao,
        status: createSubcategoriaDto.status,
        idCategoria: categoria
      });
      await queryRunner.manager.save(subcategoria);
      await queryRunner.commitTransaction();
      return subcategoria;
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
      return await this.subcategoriaRepository.find({ relations: { idCategoria: true } });
    } catch (error) {
      console.log(error);
      throw new HttpException(error, 500);
    }
  }

  async findOne(id: number) {
    try {
      return this.subcategoriaRepository.findOneBy({ id });
    } catch (error) {
      console.log(error);
      throw new HttpException(error, 500);
    }
  }

  async update(id: number, updateSubcategoriaDto: UpdateSubcategoriaDto) {
    const queryRunner = this.dataSource.createQueryRunner();
    console.log('atualizando subcategoria ', id, ' com ', updateSubcategoriaDto)
    try {
      await queryRunner.connect();
      await queryRunner.startTransaction();
      const subcategoria = await this.subcategoriaRepository.findOneBy({ id });
      if (!subcategoria) {
        throw new HttpException('Subcategoria não encontrada', 404);
      }
      let categoria = null
      if (updateSubcategoriaDto.idCategoria) {
        categoria = await this.categoriaRepository.findOneBy({
          id: updateSubcategoriaDto.idCategoria
        })
      }
      await queryRunner.manager.update(Subcategoria, id, {
        descricao: updateSubcategoriaDto.descricao,
        idCategoria: categoria || subcategoria.idCategoria,
        status: updateSubcategoriaDto.status,
      });
      await queryRunner.commitTransaction();
      return await this.subcategoriaRepository.find({ where: { id }, relations: { idCategoria: true } });
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
      const subcategoria = await this.subcategoriaRepository.findOneBy({ id });
      if (!subcategoria) {
        throw new HttpException('Subcategoria não encontrada', 404);
      }
      await queryRunner.manager.delete(Subcategoria, id);
      await queryRunner.commitTransaction();
      return {
        message: 'Subcategoria deletada com sucesso',
        nome: subcategoria.descricao
      };
    } catch (error) {
      console.log(error);
      await queryRunner.rollbackTransaction();
      throw new HttpException(error, 500);
    } finally {
      await queryRunner.release();
    }
  }
}
