import { Module } from '@nestjs/common';
import { SubcategoriaService } from './subcategoria.service';
import { SubcategoriaController } from './subcategoria.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Subcategoria } from './entities/subcategoria.entity';
import { Categoria } from 'src/categoria/entities/categoria.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Subcategoria,
      Categoria
    ]),
  ],
  controllers: [SubcategoriaController],
  providers: [SubcategoriaService],
})
export class SubcategoriaModule { }
