import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class CreateAuthDto {
    @ApiProperty(
        {
            example: 'admin',
            description: 'Nome do usuário',
            required: true
        }
    )
    @IsNotEmpty({ message: 'O usuário é obrigatório' })
    @IsString({ message: 'O usuário deve ser uma string' })
    usuario: string;
    @ApiProperty(
        {
            example: 'admin123',
            description: 'Senha do usuário',
            required: true
        }
    )
    @IsNotEmpty({ message: 'A senha é obrigatória' })
    @IsString({ message: 'A senha deve ser uma string' })
    senha: string;
}
