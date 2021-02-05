import { Injectable } from "@nestjs/common";
import { User } from "src/users/user.entity";
import { Transporter, SentMessageInfo } from 'nodemailer'
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailerService {

  private transporter!: Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: 'smtp-relay.sendinblue.com',
      port: 587,
      auth: {
        user: 'cassiano.pvianna@gmail.com',
        pass: 'bafWjYAGvr0pq75k',
      }
    })
  }

  async sendConfirmCode(user: User, confirmCode: string) {
    let host = 'http://localhost:3000'
    var mailOptions = {
      from: 'CT Puzzle Platform <ctpuzzleteam@ctpuzzleplatform.com>',
      to: `${user.name} <${user.email}>`,
      subject: 'Código de confirmação do CT Puzzle Platform',
      text: `
      <p>Este é seu código de confirmação.<p> <h1>${confirmCode}</h1><a href="${host}/signin/confirm-code?code=${confirmCode}&mail=${user.email}"> Ou clique aqui para confirmar </a>
      `
    };

    let messageInfo: SentMessageInfo = await this.transporter.sendMail(mailOptions)
    console.info('Mensagem enviada ', messageInfo);
  }

}
