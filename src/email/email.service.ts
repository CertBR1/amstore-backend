import { MailerService } from '@nestjs-modules/mailer';
import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EmailConfig } from './entities/email-config';
import { Repository } from 'typeorm';
import { CreateConfigEmailDto } from './dto/create-config-email.dto';

@Injectable()
export class EmailService {
    constructor(
        @InjectRepository(EmailConfig)
        private readonly emailConfigRepository: Repository<EmailConfig>,
    ) { }

    async enviarCodigo(cod: string, email: string) {
        try {
            const emailConfig = await this.emailConfigRepository.findOne({ where: { status: true } })
            if (!emailConfig) {
                throw new HttpException('Email não configurado', 404)
            }
            const mailer = new MailerService({
                transport: {
                    host: emailConfig.host,
                    port: emailConfig.port,
                    secure: false,
                    auth: {
                        user: emailConfig.username,
                        pass: emailConfig.password
                    }
                }
            },
                null
            )
            const info = await mailer.sendMail({
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

    async criarConfiguracaoEmail(createConfigEmailDto: CreateConfigEmailDto) {
        try {
            console.log(createConfigEmailDto)
            const emailConfig = this.emailConfigRepository.create(createConfigEmailDto)
            return await this.emailConfigRepository.save(emailConfig)
        } catch (error) {
            console.log(error)
            throw new HttpException(error, 500)
        }
    }
}
