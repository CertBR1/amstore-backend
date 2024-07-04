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

    saldo: string;
    moeda: string;
    status: boolean;
}
