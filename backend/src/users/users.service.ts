import { ForbiddenException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from 'typeorm';
import { User, UserRole } from "src/users/user.entity";
import { GeneratorService } from "src/generators/generators.service";
import { MailerService } from "src/mailer/mailer.service";
import { v4 as uuidV4 } from 'uuid';
import ResearchGroup from "src/research-group/research-group.entity";

@Injectable()
export class UsersService {


    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
        private generator: GeneratorService,
        private mailer: MailerService
    ) { }

    async save(userPayload: User, sendMail: boolean = true): Promise<User> {
        let user = Object.assign(new User(), userPayload);
        if (sendMail) {
            let confirmCodeLength = 5;
            let confirmCode = this.sendMailWithConfirmationCode(user, confirmCodeLength);
            user.confirmationCode = confirmCode;
        }

        if (!user.researchGroup) {
            this.createReseachGroupToUser(user);
        }
        return this.userRepository.save(user)
    }

    createReseachGroupToUser(user: User) {
        if (!user.hash) {
            user.hash = uuidV4()
        }
        user.addRole(UserRole.ADMIN);
        user.researchGroup = new ResearchGroup();
        user.researchGroup.name = "Grupo Pesquisa " + user.hash.substr(0, 5);
    }

    sendMailWithConfirmationCode(user: User, confirmCodeLength: number): string {
        let confirmCode = this.generator.generateNumberString(confirmCodeLength);
        this.mailer.sendConfirmCode(user, confirmCode);
        console.info('Generated code: ', confirmCode);
        return confirmCode;
    }

    async saveOrGetByHash(user: User): Promise<User> {
        let foundUser: User = await this.userRepository.findOne({ hash: user.hash })
        if (!foundUser) {
            foundUser = await this.save(user, false);
        }
        return foundUser;
    }

    async validateConfirmationCode(validationInfo: { email: string; code: string; }): Promise<boolean> {
        let user: User = await this.userRepository.findOne({ email: validationInfo.email })
        console.info('Encontrado usuário: ', user)
        let isCodeValid = user.confirmationCode == validationInfo.code;
        console.info('Código é valido: ', isCodeValid)
        return Promise.resolve(isCodeValid);
    }

    async sendPasswordRecoveryLink(email: string): Promise<any> {
        let user: User = await this.userRepository.findOne({ email });
        if (!user) {
            throw new ForbiddenException('Não foi encontrado usuário com esse email')
        }
        user.recoverPasswordHash = uuidV4();
        this.userRepository.save(user);
        this.mailer.sendPasswordRecoveryLink(user, user.recoverPasswordHash);
    }

    async findByUsername(username: string): Promise<User> {
        let user = await this.userRepository.createQueryBuilder('user')
            .leftJoinAndSelect('user.researchGroup', 'researchGroup')
            .where({ email: username })
            .getOne();
        if (!user.researchGroup) {
            this.createReseachGroupToUser(user);
        }
        return user
    }

    async validateRecoveryLink(hash: string): Promise<boolean> {
        let isLinkValid = false;
        let user: User = await this.userRepository.findOne({ recoverPasswordHash: hash });
        if (user) {
            isLinkValid = true;
        }
        return Promise.resolve(isLinkValid);
    }

    async updatePassword(updatePasswordInfo: { hash: string; newPassword: string; }): Promise<any> {
        let user: User = await this.userRepository.findOne({ recoverPasswordHash: updatePasswordInfo.hash });
        if (user) {
            user.recoverPasswordHash = null;
            user.password = updatePasswordInfo.newPassword;
            this.userRepository.save(user);
        }
    }
}
