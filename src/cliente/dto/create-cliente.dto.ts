import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class CreateClienteDto {
    @ApiProperty(
        {
            description: 'Nome do cliente',
            example: 'Joaquim'
        }
    )
    @IsString({ message: 'O nome do cliente deve ser uma string' })
    @IsNotEmpty({ message: 'O nome do cliente não pode ser vazio' })
    nome: string;

    @ApiProperty(
        {
            description: 'Whatsapp do cliente',
            example: '11999999999'
        }
    )
    @IsString({ message: 'O whatsapp do cliente deve ser uma string' })
    @IsNotEmpty({ message: 'O whatsapp do cliente não pode ser vazio' })
    whatsapp: string;

    @ApiProperty(
        {
            description: 'Email do cliente',
            example: 'Joaquim@.com'
        }
    )
    @IsEmail({}, { message: 'O email do cliente deve ser um email válido' })
    @IsNotEmpty({ message: 'O email do cliente não pode ser vazio' })
    email: string;
}
