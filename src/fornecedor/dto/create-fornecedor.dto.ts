import { ApiProperty } from "@nestjs/swagger";
import { IsCurrency, IsNotEmpty, IsString } from "class-validator";

export class CreateFornecedorDto {
    @ApiProperty(
        {
            description: 'Nome do Fornecedor',
            example: 'Fornecimento de Produtos'
        }
    )
    @IsNotEmpty({ message: 'O nome do fornecedor não pode ser vazio' })
    @IsString({ message: 'O nome do fornecedor deve ser uma string' })
    nome: string;

    @ApiProperty(
        {
            description: 'Url do Fornecedor',
            example: 'https://amstore.com.br'
        }
    )
    @IsNotEmpty({ message: 'A url do fornecedor não pode ser vazia' })
    @IsString({ message: 'A url do fornecedor deve ser uma string' })
    url: string;

    @ApiProperty(
        {
            description: 'Chave do Fornecedor',
            example: 'amstore'
        }
    )
    @IsNotEmpty({ message: 'A chave do fornecedor não pode ser vazia' })
    @IsString({ message: 'A chave do fornecedor deve ser uma string' })
    key: string;

    @ApiProperty(
        {
            description: 'Saldo do Fornecedor',
            example: '1000'
        }
    )
    @IsCurrency({ allow_negatives: false }, { message: 'O saldo do fornecedor deve ser um número' })
    saldo: number;

    @ApiProperty(
        {
            description: 'Moeda do Fornecedor',
            example: 'BRL'
        }
    )
    @IsNotEmpty({ message: 'A moeda do fornecedor não pode ser vazia' })
    @IsString({ message: 'A moeda do fornecedor deve ser uma string' })
    moeda: string;

    @ApiProperty(
        {
            description: "Status do Fornecedor",
            example: 'Ativo'
        }
    )
    @IsNotEmpty({ message: 'O status do fornecedor não pode ser vazio' })
    @IsString({ message: 'O status do fornecedor deve ser uma string' })
    status: string;
}
