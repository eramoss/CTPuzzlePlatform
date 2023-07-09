import { Injectable } from '@nestjs/common';
import { User } from 'src/users/user.entity';
import { Transporter, SentMessageInfo } from 'nodemailer';
import * as nodemailer from 'nodemailer';
import Mail from 'nodemailer/lib/mailer';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MailerService {
  private transporter!: Transporter;

  private siteUrl!: string;
  private mailFrom!: string;

  constructor(private configService: ConfigService) {
    this.siteUrl = this.configService.get('SITE_URL');
    this.mailFrom = this.configService.get('MAIL_FROM');

    const mailHost = this.configService.get('MAIL_HOST');
    const mailUser = this.configService.get('MAIL_USER');
    const mailPass = this.configService.get('MAIL_PASS');
    const mailPort = this.configService.get('MAIL_PORT');

    this.transporter = nodemailer.createTransport({
      host: mailHost,
      port: mailPort,
      auth: {
        user: mailUser,
        pass: mailPass,
      },
    });
  }

  async sendConfirmCode(user: User, confirmCode: string) {
    const mailOptions = {
      from: this.mailFrom,
      to: `${user.name} <${user.email}>`,
      subject: 'Código de confirmação do CT Puzzle Platform',
      text: `
      <p>Este é seu código de confirmação.<p> <h1>${confirmCode}</h1><a href="${this.siteUrl}/signin/confirm-code?code=${confirmCode}&mail=${user.email}"> Ou clique aqui para confirmar </a>
      `,
    };
    this.sendAndLog(mailOptions);
  }

  async sendPasswordRecoveryLink(user: User, hash: string) {
    const recoverLink = this.siteUrl + '/recover-password?hash=' + hash;
    const mailOptions = {
      from: this.mailFrom,
      to: `${user.name} <${user.email}>`,
      subject: 'Link de recuperação de senha',
      text: `<p>Este é seu link de recuperação de senha: <a href="${recoverLink}">${recoverLink}</a>.<p>
      `,
    };
    this.sendAndLog(mailOptions);
  }

  async sendAndLog(mailOptions: Mail.Options) {
    const messageInfo: SentMessageInfo = await this.transporter.sendMail(
      mailOptions,
    );
    console.info('Mensagem enviada ', messageInfo);
  }
}
