import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class CreateAdminDto {
    @ApiProperty({ example: 'admin', description: 'Nome do administrador' })
    @IsNotEmpty({ message: 'O nome do administrador não pode ser vazio' })
    @IsString({ message: 'O nome do administrador deve ser uma string' })
    nome: string;

    @ApiProperty({ example: 'admin', description: 'Usuario do administrador' })
    @IsNotEmpty({ message: 'O usuario do administrador não pode ser vazio' })
    @IsString({ message: 'O usuario do administrador deve ser uma string' })
    usuario: string;

    @ApiProperty({ example: '12345', description: 'Senha do administrador' })
    @IsNotEmpty({ message: 'A senha do administrador não pode ser vazia' })
    @IsString({ message: 'A senha do administrador deve ser uma string' })
    senha: string;
}
