import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsHexColor, IsNotEmpty, IsString, IsUrl } from "class-validator";

export class CreateConfigSistemaDto {
    @ApiProperty({
        description: 'Nome da loja',
        example: 'Amstore'
    })
    @IsString({ message: 'O nome da loja deve ser uma string' })
    @IsNotEmpty({ message: 'O nome da loja não pode ser vazio' })
    nomeLoja: string;

    @ApiProperty({
        description: 'Url do chat do whatsapp',
        example: 'https://chat.whatsapp.com/'
    })
    urlWhatsapp: string;

    @ApiProperty({
        description: 'Key do chat do whatsapp',
        example: 'key'
    })
    keyWhatsapp: string;

    @ApiProperty({
        description: 'Cor da loja',
        example: '#000000'
    })
    @IsHexColor({ message: 'A cor da loja deve ser uma cor hexadecimal válida' })
    @IsNotEmpty({ message: 'A cor da loja não pode ser vazia' })
    cor: string;

    @ApiProperty({
        description: 'Logo da loja branca',
        example: 'https://example.com/logo.png'
    })
    logoBranca: string;

    @ApiProperty({
        description: 'Icone da loja',
        example: 'https://example.com/icon.png'
    })
    @IsUrl({}, { message: 'O icone da loja deve ser uma url válida' })
    @IsNotEmpty({ message: 'O icone da loja não pode ser vazio' })
    icon: string;

    @ApiProperty({
        description: 'Logo da loja',
        example: 'https://example.com/logo.png'
    })
    @IsUrl({}, { message: 'O logo da loja deve ser uma url válida' })
    @IsNotEmpty({ message: 'O logo da loja não pode ser vazio' })
    logo: string;

    @ApiProperty({
        description: 'Status da loja',
        example: 'Ativo'
    })
    @IsBoolean({ message: 'O status da loja deve ser um boolean' })
    @IsNotEmpty({ message: 'O status da loja não pode ser vazio' })
    status: boolean;

    @ApiProperty({
        description: 'Url do video',
        example: 'https://example.com/video.mp4'
    })
    urlVideo: string;
    whatsappSuporte: string;
    whatsappVendas: string;

}
