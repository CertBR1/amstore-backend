import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsPositive, IsString } from "class-validator";

export class CreateSubcategoriaDto {

    @ApiProperty(
        {
            description: 'Descrição da subcategoria',
            example: 'Curtidas',
            type: String
        }
    )
    @IsString({ message: 'Descrição deve ser uma string' })
    @IsNotEmpty({ message: 'Descrição não pode ser vazio' })
    descricao: string;

    @ApiProperty(
        {
            description: 'Status da subcategoria',
            example: 'Ativo',
            type: String
        }
    )
    @IsString({ message: 'Status deve ser uma string' })
    @IsNotEmpty({ message: 'Status não pode ser vazio' })
    status: string;

    @ApiProperty(
        {
            description: 'Id da categoria',
            example: 1,
            type: Number
        }
    )
    @IsNotEmpty({ message: 'Id da categoria não pode ser vazio' })
    @IsPositive({ message: 'Id da categoria deve ser um número positivo' })
    idCategoria: number;
}
