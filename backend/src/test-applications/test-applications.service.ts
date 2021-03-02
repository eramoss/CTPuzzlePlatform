import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PageRequest } from 'src/pagination/pagerequest.dto';
import { PageResponse } from 'src/pagination/pageresponse.dto';
import { TestItem } from 'src/tests/test-item.entity';
import { DeleteResult, Repository } from 'typeorm';
import { TestApplication } from './test-application.entity';

@Injectable()
export class TestApplicationsService {

    constructor(@InjectRepository(TestApplication) private testApplicationRepository: Repository<TestApplication>) {

    }

    save(testApplication: TestApplication): Promise<TestApplication> {
        return this.testApplicationRepository.save(testApplication);
    }

    getById(id: number): Promise<TestApplication> {
        return this.testApplicationRepository.findOne({ id }, { relations: ['test'] });
    }

    async getByHash(hash: string): Promise<TestApplication> {
        const testApplication = await this.testApplicationRepository
            .createQueryBuilder('test-application')
            .leftJoinAndSelect('test-application.test', 'test')
            .leftJoinAndSelect('test.items', 'testItem')
            .leftJoinAndSelect('testItem.item', 'item')
            .where({ hash })
            .getOne();
        testApplication.test.sortItemsByOrder()
        return testApplication;
    }

    removeById(id: number): Promise<DeleteResult> {
        return this.testApplicationRepository.delete({ id })
    }

    async paginate(pageRequest: PageRequest): Promise<PageResponse<TestApplication>> {
        let where = pageRequest.filter
        let data = await this.testApplicationRepository.createQueryBuilder('test-application')
            .leftJoinAndSelect('test-application.test', 'test')
            .skip(pageRequest.start)
            .take(pageRequest.limit)
            .where(where)
            .getMany();
        return new PageResponse(data);
    }
}
