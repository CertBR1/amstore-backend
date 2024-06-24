import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsPositive, IsString } from "class-validator";

export class CreateInfoServicoAdcionaisDto {
    @ApiProperty(
        {
            example: 'Pode ser dividido em 2 contas?',
            description: 'Pergunta da informação adcional'
        }
    )
    @IsString({ message: 'A pergunta da informação adcional deve ser uma string' })
    @IsNotEmpty({ message: 'A pergunta da informação adcional não pode ser vazio' })
    pergunta: string;


    @ApiProperty(
        {
            example: 'Não',
            description: 'Resposta da informação adcional'
        }
    )
    @IsString({ message: 'Resposta deve ser uma string' })
    @IsNotEmpty({ message: 'Resposta não pode ser vazio' })
    reposta: string;


    @ApiProperty(
        {
            example: 'Pode ser dividido em 2 contas?',
            description: 'Descrição da informação adcional'
        }
    )
    @IsString({ message: 'Descrição deve ser uma string' })
    @IsNotEmpty({ message: 'Descrição não pode ser vazio' })
    descricao: string;


    @ApiProperty(
        {
            example: '1',
            description: 'Id do Servico'
        }
    )
    @IsNotEmpty({ message: 'Servico não pode ser vazio' })
    @IsPositive({ message: 'Servico deve ser um número positivo' })
    idServico: number;
}