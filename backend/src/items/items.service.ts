import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PageRequest } from 'src/pagination/pagerequest.dto';
import { PageResponse } from 'src/pagination/pageresponse.dto';
import { Repository } from 'typeorm';
import { Item } from './item.entity';

@Injectable()
export class ItemsService {

  constructor(
    @InjectRepository(Item)
    private itemRepository: Repository<Item>) { }

  save(item: Item): Promise<Item> {
    return this.itemRepository.save(item)
  }

  async getById(id: number): Promise<Item> {
    let item = await this.itemRepository.findOne({ id }, { relations: ['mechanic'] })
    return item;
  }

  removeById(id: number) {
    this.itemRepository.delete({ id })
  }

  async paginate(pageRequest: PageRequest): Promise<PageResponse<Item>> {
    const data = await this.itemRepository.createQueryBuilder('item')
      .skip(pageRequest.start)
      .take(pageRequest.limit)
      .getMany()
    return new PageResponse(data);
  }
}
