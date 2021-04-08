import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ItemResponsesService } from 'src/item-responses/item-responses.service';
import { ItemsService } from 'src/items/items.service';
import { Mechanic } from 'src/mechanics/mechanic.entity';
import { PageRequest } from 'src/pagination/pagerequest.dto';
import { PageResponse } from 'src/pagination/pageresponse.dto';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { TestItem } from './test-item.entity';
import { Test } from './test.entity';

@Injectable()
export class TestService {


    constructor(
        @InjectRepository(Test)
        private testRepository: Repository<Test>,
        private itemService: ItemsService,
        private itemResponseService: ItemResponsesService,
    ) { }

    save(test: Test): Promise<Test> {
        return this.testRepository.save(test);
    }

    async getById(id: number): Promise<Test> {
        let test = await this.testRepository.createQueryBuilder('test')
            .where({ id })
            .leftJoinAndSelect('test.items', 'testItem')
            .leftJoinAndSelect('testItem.item', 'item')
            .orderBy('testItem.order', 'ASC')
            .withDeleted()
            .getOne();
        await Promise.all(test.items.map(async item => {
            item.countItemResponses = await this.itemResponseService.countByItem(item)
        }))
        return test;
    }

    findAll(researchGroupId: number): Promise<Test[]> {
        return this.testRepository.createQueryBuilder('test')
            .where({
                researchGroup: {
                    id: researchGroupId
                }
            })
            .orderBy('test.id', 'DESC')
            .getMany();
    }

    softDeleteById(id: number): Promise<DeleteResult> {
        return this.testRepository.softDelete({ id })
    }

    restore(id: number): Promise<UpdateResult> {
        return this.testRepository.restore({ id })
    }

    async paginate(pageRequest: PageRequest): Promise<PageResponse<Test>> {
        const data = await this.testRepository.createQueryBuilder('test')
            .skip(pageRequest.start)
            .take(pageRequest.limit)
            .where(pageRequest.filter)
            .leftJoinAndSelect('test.items', 'item')
            .leftJoinAndSelect('test.applications', 'application', 'application."deletedAt" is null')
            .orderBy("test.id", "DESC")
            .getMany()
        return new PageResponse(data);
    }

    async getPuzzleBaseUrl(id: number): Promise<string> {
        let baseUrl = ''
        let test = await this.testRepository.createQueryBuilder("test")
            .leftJoinAndSelect("test.items", 'testItem')
            .leftJoinAndSelect("testItem.item", 'item')
            .leftJoinAndSelect("item.mechanic", 'mechanic')
            .withDeleted()
            .where({ id })
            .getOne()
        if (test) {
            if (test.items.length) {
                baseUrl = test.items[0].item.mechanic.baseUrl
            }
        }
        return baseUrl;
    }

    async generateJson(testId: number): Promise<any> {
        const test = await this.getById(testId);
        let testJson = {
            id: test.id,
            name: test.name,
            items: []
        };
        testJson.items = await Promise.all(test.items.map(async (testItem) => {
            let itemJson = await this.itemService.instantiateToGetJson(testItem.item.id)
            return {
                id: testItem.id,
                item: itemJson
            }
        }))
        return testJson;
    }

    getMechanicFromTestItem(testItem: TestItem): Promise<Mechanic> {
        return this.itemService.getMechanicFromTestItem(testItem);
    }
}
