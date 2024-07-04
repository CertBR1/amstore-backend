import { ApiProperty } from "@nestjs/swagger"
import { IsBoolean, IsNotEmpty, IsString } from "class-validator"

export class CreateCategoriaDto {

    @ApiProperty({
        example: 'INSTAGRAM',
        description: 'Nome da categoria',
        required: true
    })
    @IsNotEmpty({ message: 'Nome da categoria é obrigatório' })
    @IsString({ message: 'Nome da categoria deve ser uma string' })
    nome: string

    @ApiProperty({
        example: 'https://placehold.co/80x80/orange/white',
        description: 'Url da imagem da categoria',
        required: true
    })
    @IsNotEmpty({ message: 'Url da imagem da categoria é obrigatório' })
    @IsString({ message: 'Url da imagem da categoria deve ser uma string' })
    imagemUrl: string


    @ApiProperty({
        example: 'true',
        description: 'Status da categoria',
        required: true
    })
    @IsNotEmpty({ message: 'Status da categoria é obrigatório' })
    @IsBoolean({ message: 'Status da categoria deve ser um booleano' })
    status: boolean;
}
