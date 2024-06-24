import { ApiProperty } from "@nestjs/swagger"
import { IsNotEmpty, IsPositive } from "class-validator"

export class CreateInfoServicoAdcionaisDto {
    @ApiProperty({
        example: '1',
        description: 'Id do Serviço'
    })
    @IsNotEmpty({ message: 'Id do Serviço é obrigatório' })
    @IsPositive({ message: 'Id do Serviço deve ser um número positivo' })
    idServico: number

    @ApiProperty({
        example: '2022-01-01',
        description: 'Data de Início do Envio'
    })
    @IsNotEmpty({ message: 'Data de Início do Envio é obrigatório' })
    inicioEnvio: string

    @ApiProperty({
        example: 'Excelente',
        description: 'Qualidade do Serviço'
    })
    @IsNotEmpty({ message: 'Qualidade do Serviço é obrigatório' })
    qualidade: string

    @ApiProperty({
        example: 'Excelente',
        description: 'Velocidade do Serviço'
    })
    @IsNotEmpty({ message: 'Velocidade do Serviço é obrigatório' })
    velocidade: string
}