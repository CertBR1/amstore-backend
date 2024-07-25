import { MailerService } from '@nestjs-modules/mailer';
import { HttpException, Injectable } from '@nestjs/common';

@Injectable()
export class EmailService {
    constructor(
        private readonly mailerService: MailerService
    ) { }

    async enviarCodigo(cod: string, email: string) {
        try {
            const info = await this.mailerService.sendMail({
                to: email,
                subject: 'Código de verificação login',
                text: 'Código de verificação: ' + cod,
                from: process.env.EMAIL_FROM
            })
            return info
        } catch (error) {
            console.log(error)
            throw new HttpException(error, 500)
        }
    }

}
