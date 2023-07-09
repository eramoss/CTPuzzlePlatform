import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, DeleteResult, Repository, UpdateResult } from 'typeorm';
import { User, UserRole } from 'src/users/user.entity';
import { GeneratorService } from 'src/generators/generators.service';
import { MailerService } from 'src/mailer/mailer.service';
import { v4 as uuidV4 } from 'uuid';
import ResearchGroup from 'src/research-group/research-group.entity';
import { PageRequest } from 'src/pagination/pagerequest.dto';
import { PageResponse } from 'src/pagination/pageresponse.dto';

@Injectable()
export class UsersService {
  getById(id: number): Promise<User | undefined> {
    return this.userRepository
      .createQueryBuilder('user')
      .where({ id })
      .getOne();
  }

  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private generator: GeneratorService,
    private mailer: MailerService,
  ) {}

  async paginate(pageRequest: PageRequest): Promise<PageResponse<User>> {
    const search = pageRequest.search;
    const filter = pageRequest.filter;
    const data = await this.userRepository
      .createQueryBuilder('user')
      .where(filter)
      .andWhere(
        new Brackets((qb) => {
          qb.where('lower(user.name) like :search', {
            search: `%${search.toLowerCase()}%`,
          });
        }),
      )
      .skip(pageRequest.start)
      .take(pageRequest.limit)
      .orderBy('user.name', 'DESC')
      .getMany();
    return new PageResponse<User>(data);
  }

  setResearchGroup(user: User, researchGroup: ResearchGroup): Promise<User> {
    user.researchGroup = researchGroup;
    return this.userRepository.save(user);
  }

  softDeleteById(id: number): Promise<DeleteResult> {
    return this.userRepository.softDelete({ id });
  }

  async saveData(userHash: string, userData: any): Promise<any> {
    const user = await this.userRepository.findOne({
      where: [{ hash: userHash }],
    });
    if (user) {
      user.data = userData;
      return this.userRepository.save(user);
    }
  }

  restore(id: number): Promise<UpdateResult> {
    return this.userRepository.restore({ id });
  }

  async save(userPayload: User, sendMail = true): Promise<User> {
    const user = Object.assign(new User(), userPayload);
    if (sendMail) {
      const confirmCodeLength = 5;
      const confirmCode = this.sendMailWithConfirmationCode(
        user,
        confirmCodeLength,
      );
      user.confirmationCode = confirmCode;
    }

    if (!user.researchGroup) {
      this.createReseachGroupToUser(user);
    }
    if (!user.roles.length) user.addRole(UserRole.ADMIN);
    return this.userRepository.save(user);
  }

  createReseachGroupToUser(user: User) {
    if (!user.hash) {
      user.hash = uuidV4();
    }
    user.researchGroup = new ResearchGroup();
    user.researchGroup.name = 'Grupo Pesquisa ' + user.hash.substr(0, 5);
  }

  sendMailWithConfirmationCode(user: User, confirmCodeLength: number): string {
    const confirmCode = this.generator.generateNumberString(confirmCodeLength);
    this.mailer.sendConfirmCode(user, confirmCode);
    console.info('Generated code: ', confirmCode);
    return confirmCode;
  }

  async saveOrGetByHash(user: User): Promise<User> {
    let foundUser = await this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.researchGroup', 'researchGroup')
      .where({ hash: user.hash })
      .getOne();
    if (!foundUser) {
      foundUser = await this.save(user, false);
    }
    return foundUser;
  }

  async validateConfirmationCode(validationInfo: {
    email: string;
    code: string;
  }): Promise<boolean> {
    const user = await this.userRepository.findOne({
      where: [{ email: validationInfo.email }],
    });
    console.info('Encontrado usuário: ', user);
    let isCodeValid = false;
    if (user) {
      isCodeValid = user.confirmationCode == validationInfo.code;
      console.info('Código é valido: ', isCodeValid);
    }
    return isCodeValid;
  }

  async sendPasswordRecoveryLink(email: string): Promise<any> {
    const user = await this.userRepository.findOne({ where: [{ email }] });
    if (!user) {
      throw new ForbiddenException('Não foi encontrado usuário com esse email');
    }
    user.recoverPasswordHash = uuidV4();
    this.userRepository.save(user);
    this.mailer.sendPasswordRecoveryLink(user, user.recoverPasswordHash);
  }

  async findByUsername(username: string): Promise<User | undefined> {
    const user = await this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.researchGroup', 'researchGroup')
      .where({ email: username })
      .getOne();
    if (user) {
      if (!user.researchGroup) {
        if (!user.isSysAdmin()) {
          this.createReseachGroupToUser(user);
        }
      }
    }
    return user;
  }

  async validateRecoveryLink(hash: string): Promise<boolean> {
    let isLinkValid = false;
    const user = await this.userRepository.findOne({
      where: [{ recoverPasswordHash: hash }],
    });
    if (user) {
      isLinkValid = true;
    }
    return Promise.resolve(isLinkValid);
  }

  async updatePassword(updatePasswordInfo: {
    hash: string;
    newPassword: string;
  }): Promise<any> {
    const user = await this.userRepository.findOne({
      where: [{ recoverPasswordHash: updatePasswordInfo.hash }],
    });
    if (user) {
      user.recoverPasswordHash = undefined;
      user.password = updatePasswordInfo.newPassword;
      this.userRepository.save(user);
    }
  }
}
