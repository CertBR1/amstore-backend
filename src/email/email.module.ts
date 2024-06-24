import { Module } from '@nestjs/common';
import { EmailService } from './email.service';
import { EmailController } from './email.controller';
import { MailerModule } from '@nestjs-modules/mailer';

@Module({
  imports: [

  ],
  controllers: [EmailController],
  providers: [EmailService],
})
export class EmailModule { }
