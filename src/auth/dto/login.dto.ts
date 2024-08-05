import { ApiProperty } from "@nestjs/swagger";


export class LoginDto {
    @ApiProperty({
        type: String,
        description: 'Email do cliente enviar email ou whatsapp',
        example: 'y9Xjz@example.com'
    })
    email?: string;

    @ApiProperty({
        type: String,
        description: 'Whatsapp do cliente enviar whatsapp ou email',
        example: '11999999999'
    })
    whatsapp?: string;
}