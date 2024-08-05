import { ApiProperty } from "@nestjs/swagger"

export class CodeVerificationDto {
    @ApiProperty(
        {
            example: '123456',
            description: 'O código de verificação enviado para o email ou whatsapp do cliente',
        }
    )
    codigo: string

    @ApiProperty(
        {
            example: '123456',
            description: 'O email do cliente enviar apenas email ou whatsapp',
        }
    )
    email?: string

    @ApiProperty(
        {
            example: '123456',
            description: 'O whatsapp do cliente enviar apenas email ou whatsapp',
        }
    )
    whatsapp?: string
}