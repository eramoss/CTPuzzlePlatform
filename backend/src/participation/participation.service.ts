import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TestApplication } from 'src/test-applications/test-application.entity';
import { User } from 'src/users/user.entity';
import { Repository } from 'typeorm';
import Participation from './participation.entity';

@Injectable()
export class ParticipationService {
    
    constructor(@InjectRepository(Participation) private participationRepository: Repository<Participation>) { }

    async saveProgress(participation: Participation) {
        let id = participation.id;
        let part = await this.participationRepository.findOne({ id })
        if (part) {
            part.lastVisitedItemId = participation.lastVisitedItemId
            this.participationRepository.update({ id }, part)
        }
    }

    save(participation: Participation): Promise<Participation> {
        return this.participationRepository.save(participation)
    }

    getNonFinishedParticipation(testApplication: TestApplication, user: User): Promise<Participation> {
        return this.participationRepository.createQueryBuilder('participation')
            .where({
                application: testApplication,
                user: user,
                finishedAt: null
            })
            .getOne()
    }
}
