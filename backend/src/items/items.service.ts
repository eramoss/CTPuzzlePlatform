import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CodeInterpreterService } from 'src/code-interpreter/code-interpreter.service';
import { Mechanic } from 'src/mechanics/mechanic.entity';
import { PageRequest } from 'src/pagination/pagerequest.dto';
import { PageResponse } from 'src/pagination/pageresponse.dto';
import { TestItem } from 'src/tests/test-item.entity';
import { Brackets, DeleteResult, Repository, UpdateResult } from 'typeorm';
import { Item } from './item.entity';

@Injectable()
export class ItemsService {

    constructor(
        @InjectRepository(Item)
        private itemRepository: Repository<Item>,
        private codeInterpreterService: CodeInterpreterService
    ) { }

    save(item: Item): Promise<Item> {
        return this.itemRepository.save(item)
    }

    getById(id: number): Promise<Item> {
        return this.itemRepository.findOne({ id }, { relations: ['mechanic'] })
    }

    softDeleteById(id: number): Promise<DeleteResult> {
        return this.itemRepository.softDelete({ id })
    }

    restore(id: number): Promise<UpdateResult> {
        return this.itemRepository.restore({ id })
    }

    async paginate(researchGroupId: number, pageRequest: PageRequest): Promise<PageResponse<Item>> {
        let filter = pageRequest.filter
        let search = pageRequest.search
        const data = await this.itemRepository.createQueryBuilder('item')
            .leftJoinAndSelect('item.mechanic', 'mechanic')
            .where(filter)
            .andWhere(new Brackets(qb => {
                qb.where("mechanic.name like :search", { search: `%${search}%` })
                    .orWhere("item.name like :search", { search: `%${search}%` })
            }))
            .andWhere("mechanic.researchGroup.id = :id", { id: researchGroupId })
            .skip(pageRequest.start)
            .take(pageRequest.limit)
            .getMany()
        return new PageResponse(data);
    }

    findAll(researchGroupId: number): Promise<Item[]> {
        return this.itemRepository.createQueryBuilder('item')
            .leftJoinAndSelect('item.mechanic', 'mechanic')
            .where("mechanic.researchGroup.id = :id", { id: researchGroupId })
            .getMany();
    }

    async instantiateToGetJson(testItemId: number): Promise<any> {
        let item = await this.getById(testItemId)
        return this.getJsonFromItem(item);
    }

    async getJsonFromItem(item: Item) {
        return this.instantiateItem(item.mechanic.classDefinition, item.itemDefinition);
    }

    async instantiateItem(classDefinition: string, itemDefinition: string) {
        let code = `
        ${classDefinition}
        console.log(JSON.stringify(${itemDefinition}()))
        `
        let instantiatedItem = await this.codeInterpreterService.execute(code);
        return JSON.parse(instantiatedItem);
    }

    async getMechanicFromTestItem(testItem: TestItem): Promise<Mechanic> {
        let itemId = testItem.item.id;
        let item = await this.itemRepository.createQueryBuilder('item')
            .leftJoinAndSelect('item.mechanic', 'mechanic')
            .where({ id: itemId })
            .getOne()
        return item.mechanic;

    }
}
