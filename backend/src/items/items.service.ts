import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CodeInterpreterService } from 'src/code-interpreter/code-interpreter.service';
import { Mechanic } from 'src/mechanics/mechanic.entity';
import { PageRequest } from 'src/pagination/pagerequest.dto';
import { PageResponse } from 'src/pagination/pageresponse.dto';
import { TestItem } from 'src/tests/test-item.entity';
import { DeleteResult, Repository } from 'typeorm';
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

    removeById(id: number): Promise<DeleteResult> {
        return this.itemRepository.delete({ id })
    }

    async paginate(pageRequest: PageRequest): Promise<PageResponse<Item>> {
        const data = await this.itemRepository.createQueryBuilder('item')
            .leftJoinAndSelect('item.mechanic', 'mechanic')
            .skip(pageRequest.start)
            .take(pageRequest.limit)
            .getMany()
        return new PageResponse(data);
    }

    findAll(): Promise<Item[]> {
        return this.itemRepository.find({});
    }

    async instantiateToGetJson(testItemId: number): Promise<string> {
        let item = await this.getById(testItemId)
        let code = `
        ${item.mechanic.classDefinition}
        console.log(JSON.stringify(${item.itemDefinition}()))
        `
        let instantiatedItem = await this.codeInterpreterService.execute(code);
        return instantiatedItem;
    }

    async getMechanicFromTestItem(testItem: TestItem): Promise<Mechanic> {
        let itemId = testItem.item.id;
        let item = await this.itemRepository.createQueryBuilder('item')
        .leftJoinAndSelect('item.mechanic','mechanic')
        .where({id:itemId})
        .getOne()
        return item.mechanic;
        
    }
}
