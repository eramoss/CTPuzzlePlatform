import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from 'typeorm';
import { User } from "src/users/user.entity";
import { GeneratorService } from "src/generators/generators.service";
import { MailerService } from "src/mailer/mailer.service";

@Injectable()
export class UsersService {


  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private generator: GeneratorService,
    private mailer: MailerService
  ) { }

  async save(user: User): Promise<User> {
    let confirmCodeLength = 5;
    let confirmCode = this.sendMailWithConfirmationCode(user, confirmCodeLength);
    user.confirmationCode = confirmCode;
    return this.userRepository.save(user)
  }

  sendMailWithConfirmationCode(user: User, confirmCodeLength: number): string {
    let confirmCode = this.generator.generateNumberString(confirmCodeLength);
    //this.mailer.sendConfirmCode(user, confirmCode);
    console.info('Generated code: ', confirmCode);
    return confirmCode;
  }

  async validateConfirmationCode(validationInfo: { email: string; code: string; }): Promise<boolean> {
    let user: User = await this.userRepository.findOne({ email: validationInfo.email })
    console.info('Encontrado usuário: ', user)
    let isCodeValid = user.confirmationCode == validationInfo.code;
    console.info('Código é valido: ', isCodeValid)
    return Promise.resolve(isCodeValid);
  }
}
