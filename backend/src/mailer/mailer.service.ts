import { Injectable } from "@nestjs/common";
import { User } from "src/users/user.entity";
import { Transporter, SentMessageInfo } from 'nodemailer'
import * as nodemailer from 'nodemailer';
import Mail from "nodemailer/lib/mailer";

@Injectable()
export class MailerService {

  private transporter!: Transporter;

  //Pegar de config
  private host = 'http://localhost:3000'
  private from = 'CT Puzzle Platform <ctpuzzleteam@ctpuzzleplatform.com>'

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
    var mailOptions = {
      from: this.from,
      to: `${user.name} <${user.email}>`,
      subject: 'Código de confirmação do CT Puzzle Platform',
      text: `
      <p>Este é seu código de confirmação.<p> <h1>${confirmCode}</h1><a href="${this.host}/signin/confirm-code?code=${confirmCode}&mail=${user.email}"> Ou clique aqui para confirmar </a>
      `
    };
    this.sendAndLog(mailOptions)
  }


  async sendPasswordRecoveryLink(user: User, hash: string) {
    let recoverLink = this.host + '/recover-password?hash=' + hash;
    var mailOptions = {
      from: this.from,
      to: `${user.name} <${user.email}>`,
      subject: 'Link de recuperação de senha',
      text: `<p>Este é seu link de recuperação de senha: <a href="${recoverLink}">${recoverLink}</a>.<p>
      `
    };
    this.sendAndLog(mailOptions)
  }

  async sendAndLog(mailOptions: Mail.Options) {
    let messageInfo: SentMessageInfo = await this.transporter.sendMail(mailOptions)
    console.info('Mensagem enviada ', messageInfo);
  }

}
