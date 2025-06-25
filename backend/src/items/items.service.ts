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
    private codeInterpreterService: CodeInterpreterService,
  ) {}

  save(item: Item): Promise<Item> {
    return this.itemRepository.save(item);
  }

  getByIds(ids: number[]): Promise<Item[]> {
    return this.itemRepository
      .createQueryBuilder('item')
      .whereInIds(ids)
      .leftJoinAndSelect('item.mechanic', 'mechanic')
      .withDeleted()
      .getMany();
  }

  getById(id: number): Promise<Item> {
    return this.itemRepository
      .createQueryBuilder('item')
      .where({ id })
      .leftJoinAndSelect('item.mechanic', 'mechanic')
      .withDeleted()
      .getOne();
  }

  getManyById(ids: number[]): Promise<Item[]> {
    return this.itemRepository
      .createQueryBuilder('item')
      .whereInIds(ids)
      .leftJoinAndSelect('item.mechanic', 'mechanic')
      .getMany();
  }

  softDeleteById(id: number): Promise<DeleteResult> {
    return this.itemRepository.softDelete({ id });
  }

  restore(id: number): Promise<UpdateResult> {
    return this.itemRepository.restore({ id });
  }

  async paginate(pageRequest: PageRequest): Promise<PageResponse<Item>> {
    const search = pageRequest.search?.toUpperCase();
    const data = await this.itemRepository
      .createQueryBuilder('item')
      .leftJoinAndSelect('item.mechanic', 'mechanic')
      .where(pageRequest.filter)
      .andWhere(
        new Brackets((qb) => {
          qb.where('upper(mechanic.name) like :search', {
            search: `%${search}%`,
          }).orWhere('upper(item.name) like :search', {
            search: `%${search}%`,
          });
        }),
      )
      .andWhere(pageRequest.andWhere)
      .orderBy('item.id', 'DESC')
      .skip(pageRequest.start)
      .take(pageRequest.limit)
      .getMany();
    return new PageResponse(data);
  }

  findAll(researchGroupId: number): Promise<Item[]> {
    return this.itemRepository
      .createQueryBuilder('item')
      .leftJoinAndSelect('item.mechanic', 'mechanic')
      .where('mechanic.researchGroup.id = :id', { id: researchGroupId })
      .getMany();
  }

  async instantiateToGetJson(itemId: number): Promise<any> {
    const item = await this.getById(itemId);
    return this.getJsonFromItem(item);
  }

  async getJsonFromItem(item: Item): Promise<object> {
    return this.instantiateItem(
      item.mechanic.classDefinition,
      item.itemDefinition,
    );
  }

  async getJsonFromItems(items: Item[]): Promise<object[]> {
    const classes = [];
    items.forEach((item) => {
      const classDefinition = item.mechanic.classDefinition;
      if (classes.indexOf(classDefinition) == -1) {
        classes.push(classDefinition);
      }
    });
    const classesDefinitions = classes.join('\n');
    const itemsDefinitionsFunctions = items
      .map((item, index) => `itemsJsons[${index}] = (${item.itemDefinition}())`)
      .join('\n');
    const code = `
        ${classesDefinitions}
        let itemsJsons = []
        ${itemsDefinitionsFunctions}
        console.log(JSON.stringify(itemsJsons))
        `;
    const arrayOfItems = await this.codeInterpreterService.execute(code);
    return JSON.parse(arrayOfItems);
  }

  async instantiateItem(
    classDefinition: string,
    itemDefinition: string,
  ): Promise<object> {
    const code = `
            ${classDefinition}
            console.log(JSON.stringify( ${itemDefinition}() ))
        `;
    const instantiatedItem = await this.codeInterpreterService.execute(code);
    console.log('JSON to parse ', instantiatedItem);
    return JSON.parse(instantiatedItem);
  }

  async getMechanicFromTestItem(testItem: TestItem): Promise<Mechanic> {
    const itemId = testItem.item.id;
    const item = await this.itemRepository
      .createQueryBuilder('item')
      .leftJoinAndSelect('item.mechanic', 'mechanic')
      .where({ id: itemId })
      .getOne();
    return item.mechanic;
  }
}
