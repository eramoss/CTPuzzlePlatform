import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PageRequest } from 'src/pagination/pagerequest.dto';
import { PageResponse } from 'src/pagination/pageresponse.dto';
import { Repository } from 'typeorm';
import { TestItem } from './test-item.entity';
import { Test } from './test.entity';

@Injectable()
export class TestService {

    constructor(
        @InjectRepository(Test) private testRepository: Repository<Test>,
    ) { }

    save(test: Test): Promise<Test> {
        return this.testRepository.save(test);
    }

    async getById(id: number): Promise<Test> {
        let test = await this.testRepository.findOne({ id }, { relations: ['items', 'items.item'] })
        test.items.sort((a, b) => a.order - b.order)
        console.info('Test encontrado', test);
        return test;
    }

    removeById(id: number) {
        this.testRepository.delete({ id })
    }

    async paginate(pageRequest: PageRequest): Promise<PageResponse<Test>> {
        const data = await this.testRepository.createQueryBuilder('test')
            .skip(pageRequest.start)
            .take(pageRequest.limit)
            .innerJoinAndSelect('test.items', 'item')
            .getMany()
        return new PageResponse(data);
    }
}
