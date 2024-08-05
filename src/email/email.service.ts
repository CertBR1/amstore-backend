import { MailerService } from '@nestjs-modules/mailer';
import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EmailConfig } from './entities/email-config';
import { Repository } from 'typeorm';
import { CreateConfigEmailDto } from './dto/create-config-email.dto';
import { ConfigSistema } from 'src/config-sistema/entities/config-sistema.entity';
import { templateEmail } from 'src/utils/email.template';
import { Functions } from 'src/utils/func.util';

@Injectable()
export class EmailService {

    constructor(
        @InjectRepository(EmailConfig)
        private readonly emailConfigRepository: Repository<EmailConfig>,
        @InjectRepository(ConfigSistema)
        private readonly configSistemaRepository: Repository<ConfigSistema>
    ) { }


    async enviarCodigo(cod: string, email: string, user: string) {
        try {
            const emailConfig = await this.emailConfigRepository.findOne({ where: { status: true } })
            const configLoja = await this.configSistemaRepository.findOne({ where: { status: true } })
            if (!emailConfig) {
                throw new HttpException('Email não configurado', 404)
            }
            const template = templateEmail
            const templateComVariaveis = Functions.replacePlaceholders(template, {
                logo: configLoja.logo,
                user: user,
                codigo: cod,
                nomeLoja: configLoja.nomeLoja
            })
            const mailer = new MailerService({
                transport: {
                    host: emailConfig.host,
                    port: emailConfig.port,
                    secure: false,
                    auth: {
                        user: emailConfig.username,
                        pass: emailConfig.password
                    }
                },
            },
                null
            )
            const info = await mailer.sendMail({
                to: email,
                subject: 'Código de verificação login',
                text: 'Código de verificação: ' + cod,
                from: process.env.EMAIL_FROM,
                html: templateComVariaveis
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

    async getConfiguracaoEmail() {
        try {
            return await this.emailConfigRepository.find()
        } catch (error) {
            console.log(error)
            throw new HttpException(error, 500)
        }
    }

    async updateConfiguracaoEmail(id: number, updateConfigEmailDto: CreateConfigEmailDto) {
        try {
            return await this.emailConfigRepository.update(id, updateConfigEmailDto)
        } catch (error) {
            console.log(error)
            throw new HttpException(error, 500)
        }
    }

}

